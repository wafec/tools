import { ReitRankComputed, ReitRankMapped } from "./reit-cmd.types.ts";

export function reitRankReducer(o: ReitRankMapped): ReitRankComputed {
  const score =
    [o.dy * 1.3, (1 - o.p_vp) * 0.7, o.liquidez * 1.3, o.dy_cagr * 0.7]
      .map((v) => v || 0)
      .filter((v) => Number.isFinite(v))
      .reduce((acc, v) => acc + (v || 0), 0) / 4;
  return {
    ticker: o.ticker,
    score: score,
    target: o,
  };
}
