export type StockItem1Item2 = {
  Item1: string | null;
  Item2: string | null;
};

export type StockQueryProps = {
  Sector: string;
  SubSector: string;
  Segment: string;
  my_range: string;
  forecast: {
    upsidedownside: StockItem1Item2;
    estimatesnumber: StockItem1Item2;
    revisedup: boolean;
    resiseddown: boolean;
    consensus: string[];
  };
  dy: StockItem1Item2;
  p_l: StockItem1Item2;
  peg_ratio: StockItem1Item2;
  p_vp: StockItem1Item2;
  p_ativo: StockItem1Item2;
  margembruta: StockItem1Item2;
  margemebit: StockItem1Item2;
  margemliquida: StockItem1Item2;
  p_ebit: StockItem1Item2;
  ev_ebit: StockItem1Item2;
  dividaliquidaebit: StockItem1Item2;
  dividaliquidapatrimonioliquido: StockItem1Item2;
  p_sr: StockItem1Item2;
  p_capitalgiro: StockItem1Item2;
  p_ativocirculante: StockItem1Item2;
  roe: StockItem1Item2;
  roic: StockItem1Item2;
  roa: StockItem1Item2;
  liquidezcorrente: StockItem1Item2;
  pl_ativo: StockItem1Item2;
  passivo_ativo: StockItem1Item2;
  giroativos: StockItem1Item2;
  receitas_cagr5: StockItem1Item2;
  lucros_cagr5: StockItem1Item2;
  liquidezmediadiaria: StockItem1Item2;
  vpa: StockItem1Item2;
  lpa: StockItem1Item2;
  valormercado: StockItem1Item2;
};

export type StockResultProps = {
  list: StockResultItemProps[];
  totalResults: number;
  hasForecast: boolean;
};

export type StockResultItemProps = {
  companyid: number;
  companyname: string;
  ticker: string;
  price: number;
  p_l: number;
  p_vp: number;
  p_ebit: number;
  p_ativo: number;
  ev_ebit: number;
  margembruta: number;
  margemebit: number;
  margemliquida: number;
  p_sr: number;
  p_capitalgiro: number;
  p_ativocirculante: number;
  giroativos: number;
  roe: number;
  roa: number;
  roic: number;
  dividaliquidapatrimonioliquido: number;
  dividaliquidaebit: number;
  pl_ativo: number;
  passivo_ativo: number;
  liquidezcorrente: number;
  peg_ratio: number;
  receitas_cagr5: number;
  liquidezmediadiaria: number;
  vpa: number;
  lpa: number;
  valormercado: number;
};
