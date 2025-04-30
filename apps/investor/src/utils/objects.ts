import { normalize } from "./calc.ts";

export function objMax<T>(l: T[], tx: (t: T) => number): number {
  if (l.length == 0) {
    return tx(l[0]);
  }
  return l
    .slice(1)
    .map(tx)
    .reduce(
      (acc, v) => (Number.isFinite(v) ? Math.max(acc, v) : acc),
      tx(l[0]),
    );
}

export function objMin<T>(l: T[], tx: (t: T) => number): number {
  if (l.length == 1) {
    return tx(l[0]);
  }
  return l
    .slice(1)
    .map(tx)
    .reduce(
      (acc, v) => (Number.isFinite(v) ? Math.min(acc, v) : acc),
      tx(l[0]),
    );
}

export function objListMax<T extends { [k: string]: string | number }>(
  l: { [k: string]: string | number }[],
): T {
  const result = { ...l[0] };
  for (const k of Object.keys(result)) {
    if (typeof result[k] === "number") {
      result[k] = objMax(l, (o) => o[k] as number);
    }
  }
  return result as T;
}

export function objListMin<T extends { [k: string]: string | number }>(
  l: { [k: string]: string | number }[],
): T {
  const result = { ...l[0] };
  for (const k of Object.keys(result)) {
    if (typeof result[k] === "number") {
      result[k] = objMin(l, (o) => o[k] as number);
    }
  }
  return result as T;
}

export function objListNormalize<T extends { [k: string]: string | number }>(
  l: { [k: string]: string | number }[],
): T[] {
  const result: T[] = [];
  const max = objListMax(l);
  const min = objListMin(l);
  for (const o of l) {
    const t = { ...o };
    for (const k of Object.keys(o)) {
      if (typeof o[k] === "number") {
        t[k] = normalize(o[k] as number, min[k] as number, max[k] as number);
      }
    }
    result.push(t as T);
  }
  return result;
}
