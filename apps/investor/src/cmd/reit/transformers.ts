import moment from "moment";
import { objListNormalize } from "../../utils/objects.ts";
import {
  ReitRankMapped,
  ReitHtmlMetric,
  ReitResultItemProps,
  ReitInfo,
} from "./types.ts";

export function reitResultToRankMapper(o: ReitResultItemProps): ReitRankMapped {
  return {
    ticker: o.ticker,
    dy: o.dy,
    liquidez: o.liquidezmediadiaria,
    p_vp: o.p_vp,
    dy_cagr: o.dividend_cagr,
    cota_cagr: o.cota_cagr,
  };
}

export function reitRankNormalize(l: ReitRankMapped[]): ReitRankMapped[] {
  return objListNormalize(l);
}

export function reitFilter(o: ReitResultItemProps): boolean {
  return o.gestao_f === "Ativa" || o.gestao_f === "Passiva";
}

export function reitDividendResultsToMetrics(d: {
  [key: string]: string | number;
}): ReitHtmlMetric {
  return {
    date: moment(d["pd"], "DD/MM/YYYY").toDate(),
    value: d["v"] as number,
  };
}

export function reitResultToInfo(result: ReitResultItemProps): ReitInfo {
  return {
    ticker: result.ticker,
    dy: result.dy,
  };
}

export function reitResultByTicker(result: ReitResultItemProps[]): {
  [ticker: string]: ReitResultItemProps;
} {
  return result.reduce((acc, v) => ({ ...acc, [v.ticker]: v }), {});
}
