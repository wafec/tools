export type ReitItem1Item2 = {
  Item1: string | null;
  Item2: string | null;
};

export type ReitQueryProps = {
  Segment: string;
  Gestao: string;
  my_range: string;
  dy: ReitItem1Item2;
  p_vp: ReitItem1Item2;
  percentualcaixa: ReitItem1Item2;
  numerocotistas: ReitItem1Item2;
  dividend_cagr: ReitItem1Item2;
  cota_cagr: ReitItem1Item2;
  liquidezmediadiaria: ReitItem1Item2;
  patrimonio: ReitItem1Item2;
  valorpatrimonialcota: ReitItem1Item2;
  numerocotas: ReitItem1Item2;
  lastdividend: ReitItem1Item2;
};

export type ReitResultItemProps = {
  companyid: number;
  companyname: string;
  ticker: string;
  price: number;
  sectorid: number;
  sectorname: string;
  subsectorid: number;
  subsectorname: string;
  segment: string;
  segmentid: number;
  gestao: number;
  gestao_f: string;
  dy: number;
  p_vp: number;
  valorpatrimonialcota: number;
  liquidezmediadiaria: number;
  percentualcaixa: number;
  dividend_cagr: number;
  cota_cagr: number;
  numerocotistas: number;
  numerocotas: number;
  patrimonio: number;
  lastdividend: number;
};

export type ReitResultProps = {
  list: ReitResultItemProps[];
  totalResults: number;
  hasForecast: boolean;
};

export type ReitRankMapped = {
  ticker: string;
  dy: number;
  p_vp: number;
  liquidez: number;
  dy_cagr: number;
  cota_cagr: number;
};

export type ReitRankComputed = {
  ticker: string;
  score: number;
  target: ReitRankMapped;
};

export type ReitHtmlMetric = {
  date: Date;
  value: number;
};

export type ReitRankWithVariance = {
  ticker: string;
  score: number;
  variance: number;
};

export type ReitRankWithVarianceScore = ReitRankWithVariance & {
  varianceScore: number;
};

export type ReitRankCsvLine = {
  ticker: string;
  score: number;
};
