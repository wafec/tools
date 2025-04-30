import { Command } from "commander";
import fs from "node:fs";
import { ReitItem1Item2, ReitQueryProps } from "./reit-cmd.types.ts";

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

async function handleDownload(dest: string) {
  const search = encodeURI(JSON.stringify(reitQueryInitialValue));
  const take = 580;
  const response = await fetch(
    `https://statusinvest.com.br/category/advancedsearchresultpaginated?search=${search}&orderColumn=&isAsc=&page=0&take=${take}&CategoryType=2`,
  );
  const data = await response.json();
  await fs.writeFile(dest, JSON.stringify(data, null, 2), "utf-8", () => {});
}

export function makeReitCommand() {
  const reitCmd = new Command("reit");

  reitCmd.command("download").argument("dest").action(handleDownload);

  return reitCmd;
}
