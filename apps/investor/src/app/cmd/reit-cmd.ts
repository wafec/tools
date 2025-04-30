import { Command } from "commander";
import {
  ReitItem1Item2,
  ReitQueryProps,
  ReitResultProps,
} from "./reit-cmd.types.ts";
import {
  reitRankNormalize,
  reitResultToRankMapper,
} from "./reit-cmd.transformers.ts";
import { reitRankReducer } from "./reit-cmd.reducers.ts";

const reitItem1Item2InitialValue: ReitItem1Item2 = {
  Item1: null,
  Item2: null,
};

const reitQueryInitialValue: ReitQueryProps = {
  Segment: "",
  Gestao: "",
  my_range: "0;20",
  dy: reitItem1Item2InitialValue,
  p_vp: reitItem1Item2InitialValue,
  percentualcaixa: reitItem1Item2InitialValue,
  numerocotistas: reitItem1Item2InitialValue,
  dividend_cagr: reitItem1Item2InitialValue,
  cota_cagr: reitItem1Item2InitialValue,
  liquidezmediadiaria: reitItem1Item2InitialValue,
  patrimonio: reitItem1Item2InitialValue,
  valorpatrimonialcota: reitItem1Item2InitialValue,
  numerocotas: reitItem1Item2InitialValue,
  lastdividend: reitItem1Item2InitialValue,
};

export function makeReitCommand() {
  const reitCmd = new Command("reit");

  reitCmd.command("download").argument("dest").action(handleDownload);
  reitCmd
    .command("rank")
    .argument("source")
    .argument("dest")
    .action(handleRank);

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
  const rank = reitRankNormalize(data.list.map(reitResultToRankMapper)).map(
    reitRankReducer,
  );
  rank.sort((a, b) => b.score - a.score);
  let result = "";
  for (const r of rank) {
    result += `${r.ticker},${r.score}\n`;
  }
  await Deno.writeTextFile(dest, result);
}
