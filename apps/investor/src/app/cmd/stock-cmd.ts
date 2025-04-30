import { Command } from "commander";
import {
  StockItem1Item2,
  StockQueryProps,
  StockResultProps,
} from "./stock-cmd.types.ts";

const item1Item2InitialValue: StockItem1Item2 = {
  Item1: null,
  Item2: null,
};

const stockQueryInitialValue: StockQueryProps = {
  Sector: "",
  SubSector: "",
  Segment: "",
  my_range: "-20;100",
  forecast: {
    upsidedownside: item1Item2InitialValue,
    estimatesnumber: item1Item2InitialValue,
    revisedup: true,
    resiseddown: true,
    consensus: [],
  },
  dy: item1Item2InitialValue,
  p_l: item1Item2InitialValue,
  peg_ratio: item1Item2InitialValue,
  p_vp: item1Item2InitialValue,
  p_ativo: item1Item2InitialValue,
  margembruta: item1Item2InitialValue,
  margemebit: item1Item2InitialValue,
  margemliquida: item1Item2InitialValue,
  p_ebit: item1Item2InitialValue,
  ev_ebit: item1Item2InitialValue,
  dividaliquidaebit: item1Item2InitialValue,
  dividaliquidapatrimonioliquido: item1Item2InitialValue,
  p_sr: item1Item2InitialValue,
  p_capitalgiro: item1Item2InitialValue,
  p_ativocirculante: item1Item2InitialValue,
  roe: item1Item2InitialValue,
  roic: item1Item2InitialValue,
  roa: item1Item2InitialValue,
  liquidezcorrente: item1Item2InitialValue,
  pl_ativo: item1Item2InitialValue,
  passivo_ativo: item1Item2InitialValue,
  giroativos: item1Item2InitialValue,
  receitas_cagr5: item1Item2InitialValue,
  lucros_cagr5: item1Item2InitialValue,
  liquidezmediadiaria: item1Item2InitialValue,
  vpa: item1Item2InitialValue,
  lpa: item1Item2InitialValue,
  valormercado: item1Item2InitialValue,
};

async function handleDownload(dest: string) {
  const search = encodeURI(JSON.stringify(stockQueryInitialValue));
  const take = 610;
  const response = await fetch(
    `https://statusinvest.com.br/category/advancedsearchresultpaginated?search=${search}&orderColumn=&isAsc=&page=0&take=${take}&CategoryType=1`,
  );
  const data: StockResultProps = await response.json();

  await Deno.writeTextFile(dest, JSON.stringify(data, null, 2));
}

export function makeStockCommand() {
  const stockCmd = new Command("stock");

  stockCmd.command("download").argument("dest").action(handleDownload);

  return stockCmd;
}
