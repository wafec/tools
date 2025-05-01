import { Command } from "commander";
import {
  ReitRankWithVarianceComputed,
  ReitRankWithVarianceMetric,
  ReitResultProps,
} from "./types.ts";
import {
  reitDividendResultsToMetrics,
  reitFilter,
  reitRankNormalize,
  reitResultToRankMapper,
} from "./transformers.ts";
import { reitRankReducer } from "./reducers.ts";
import { reitQueryInitialValue } from "./constants.ts";
import { JSDOM } from "jsdom";
import { randomSleep, sleep } from "../../utils/lang.ts";
import moment from "moment";
import { variance } from "../../utils/calc.ts";
import { objListNormalize } from "../../utils/objects.ts";

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
    .argument("dest")
    .action(handleRankWithDividendVariance);

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
    if (count >= max) {
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
  dest: string,
) {
  const currentDate = new Date();
  const lastYearDate = moment(currentDate).add(-12, "month").toDate();
  const rankCsv = await readRankCsv(source);
  const result: ReitRankWithVarianceComputed[] = [];
  for await (const dirEntry of Deno.readDir(htmlPath)) {
    if (dirEntry.isFile) {
      const ticker = dirEntry.name.replace(".html", "");
      const dom = new JSDOM(
        await Deno.readTextFile(`${htmlPath}/${ticker}.html`),
      );
      const value = dom.window.document
        .querySelector("#results")
        ?.getAttribute("value");
      if (value) {
        const data = JSON.parse(value);
        const metrics: ReitRankWithVarianceMetric[] = data.map(
          reitDividendResultsToMetrics,
        );
        const lastYearMetrics = metrics.filter(
          (m) =>
            m.date.getTime() >= lastYearDate.getTime() &&
            m.date.getTime() <= currentDate.getTime(),
        );
        const varianceValue = variance(lastYearMetrics.map((m) => m.value));
        result.push({
          ticker: ticker,
          score: rankCsv.filter((r) => r.ticker == ticker)[0].score,
          variance: varianceValue,
        });
      }
    }
  }
  const normalized = objListNormalize<ReitRankWithVarianceComputed>(result);
  const score = normalized.map((v) => ({
    ...v,
    varianceScore: (v.score + (1 - v.variance)) / 2,
  }));
  score.sort((a, b) => b.varianceScore - a.varianceScore);
  const text = score.reduce(
    (acc, v) => `${acc}${v.ticker},${v.score},${v.varianceScore}\n`,
    "",
  );
  await Deno.writeTextFile(dest, text);
}

async function readRankCsv(
  path: string,
): Promise<{ ticker: string; score: number }[]> {
  const data = await Deno.readTextFile(path);
  return data
    .split("\n")
    .map((l) => l.split(","))
    .reduce<{ ticker: string; score: number }[]>(
      (acc, v) => [...acc, { ticker: v[0], score: parseFloat(v[1]) }],
      [],
    );
}
