import { objListNormalize } from "../../utils/objects.ts";
import { ReitRankMapped, ReitResultItemProps } from "./reit-cmd.types.ts";

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
