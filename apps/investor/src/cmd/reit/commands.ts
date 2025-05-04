import { Command } from "commander";
import {
  ReitRankWithVariance,
  ReitRankWithVarianceScore,
  ReitResultProps,
} from "./types.ts";
import {
  reitFilter,
  reitRankNormalize,
  reitResultByTicker,
  reitResultToRankMapper,
} from "./transformers.ts";
import { reitRankReducer } from "./reducers.ts";
import { reitQueryInitialValue } from "./constants.ts";
import { randomSleep } from "../../utils/lang.ts";
import moment from "moment";
import { variance } from "~/utils/calc.ts";
import { objListNormalize } from "../../utils/objects.ts";
import { readReitRankCsv, readReitsJson, ReitHtml } from "./helpers.ts";

export function makeReitCommand() {
  const reitCmd = new Command("reit");

  reitCmd.command("download").argument("dest").action(handleDownload);
  reitCmd
    .command("rank")
    .argument("source")
    .argument("dest")
    .action(handleRank);
  reitCmd
    .command("rank-html-download")
    .option("-m, --max <number>", "Max", "1")
    .argument("source")
    .argument("dest")
    .action(handleRankHtmlDownload);
  reitCmd
    .command("rank-with-dividend-variance")
    .argument("source")
    .argument("htmlPath")
    .argument("reitsPath")
    .argument("dest")
    .action(handleRankWithDividendVariance);
  reitCmd
    .command("info")
    .argument("source")
    .argument("orderSource")
    .argument("dest")
    .action(handleReitInfo);

  return reitCmd;
}

async function handleDownload(dest: string) {
  const search = encodeURI(JSON.stringify(reitQueryInitialValue));
  const take = 580;
  const response = await fetch(
    `https://statusinvest.com.br/category/advancedsearchresultpaginated?search=${search}&orderColumn=&isAsc=&page=0&take=${take}&CategoryType=2`,
  );
  const data = await response.json();
  await Deno.writeTextFile(dest, JSON.stringify(data, null, 2));
}

async function handleRank(source: string, dest: string) {
  const text = await Deno.readTextFile(source);
  const data: ReitResultProps = JSON.parse(text);
  const rank = reitRankNormalize(
    data.list.filter(reitFilter).map(reitResultToRankMapper),
  ).map(reitRankReducer);
  rank.sort((a, b) => b.score - a.score);
  let result = "";
  for (const r of rank) {
    result += `${r.ticker},${r.score}\n`;
  }
  await Deno.writeTextFile(dest, result);
}

async function handleRankHtmlDownload(
  source: string,
  dest: string,
  { max = 1 }: { max: number },
) {
  const csv = await Deno.readTextFile(source);
  let count = 0;
  for (const csvItem of csv.split("\n")) {
    if (count >= max || csvItem.trim() === "") {
      break;
    }
    const ticker = csvItem.split(",")[0].trim();
    console.info(`Downloading ${ticker}`);
    const response = await fetch(
      `https://statusinvest.com.br/fundos-imobiliarios/${ticker.toLowerCase()}`,
    );
    const html = await response.text();
    await Deno.writeTextFile(`${dest}/${ticker}.html`, html);
    await randomSleep(700, 2000);
    count++;
  }
  console.info("Download complete");
}

async function handleRankWithDividendVariance(
  source: string,
  htmlPath: string,
  reitsPath: string,
  dest: string,
) {
  const currentDate = new Date();
  const lastYearDate = moment(currentDate).add(-12, "month").toDate();
  const rankCsv = await readReitRankCsv(source);
  const reitsJson = await readReitsJson(reitsPath);
  const withVariance: ReitRankWithVariance[] = [];
  for await (const dirEntry of Deno.readDir(htmlPath)) {
    if (dirEntry.isFile) {
      const ticker = dirEntry.name.replace(".html", "");
      const reitHtml = await ReitHtml.load(`${htmlPath}/${ticker}.html`);
      const metrics = reitHtml.getMetrics();
      const lastYearMetrics = metrics.filter(
        (m) =>
          m.date.getTime() >= lastYearDate.getTime() &&
          m.date.getTime() <= currentDate.getTime(),
      );
      const varianceValue = variance(lastYearMetrics.map((m) => m.value));
      withVariance.push({
        ticker: ticker,
        score: rankCsv[ticker].score,
        variance: varianceValue,
      });
    }
  }
  const score = calculateReitRankWithVarianceScore(withVariance);
  score.sort((a, b) => b.varianceScore - a.varianceScore);
  const text = score.reduce(
    (acc, v) =>
      `${acc}${v.ticker},${reitsJson[v.ticker].segment},${v.score},${v.varianceScore}\n`,
    "",
  );
  await Deno.writeTextFile(dest, text);
}

function calculateReitRankWithVarianceScore(
  l: ReitRankWithVariance[],
): ReitRankWithVarianceScore[] {
  const normalized = objListNormalize<ReitRankWithVariance>(l);
  return normalized.map((v) => ({
    ...v,
    varianceScore: (v.score + (1 - v.variance)) / 2,
  }));
}

async function handleReitInfo(
  source: string,
  orderSource: string,
  dest: string,
) {
  const text = await Deno.readTextFile(source);
  const data: ReitResultProps = JSON.parse(text);
  const resultByTicker = reitResultByTicker(data.list);
  const order = await Deno.readTextFile(orderSource);
  const info = order
    .split("\n")
    .filter((l) => l !== "")
    .map((l) => resultByTicker[l])
    .reduce((acc, v) => acc + `${v.ticker},${v.dy},${v.cota_cagr || ""}\n`, "");
  await Deno.writeTextFile(dest, info);
}
