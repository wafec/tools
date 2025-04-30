import { objListNormalize } from "../../utils/objects.ts";
import { ReitRankMapped, ReitResultItemProps } from "./reit-cmd.types.ts";

export function reitResultToRankMapper(o: ReitResultItemProps): ReitRankMapped {
  return {
    ticker: o.ticker,
    dy: o.dy,
    liquidez: o.liquidezmediadiaria,
    p_vp: o.p_vp,
    dy_cagr: o.dividend_cagr,
    lastdividend_price: o.lastdividend / o.price,
  };
}

export function reitRankNormalize(l: ReitRankMapped[]): ReitRankMapped[] {
  return objListNormalize(l);
}
