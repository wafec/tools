export function normalize(v: number, min: number, max: number): number {
  if (max == min) {
    return 1;
  }
  return (v - min) / (max - min);
}

export function average(l: number[]): number {
  return l.reduce((acc, v) => acc + v, 0) / l.length;
}

export function variance(l: number[]): number {
  const avg = average(l);
  return l.reduce((acc, v) => acc + Math.abs(avg - v), 0);
}

export function max(l: number[]): number {
  return l.slice(1).reduce((acc, v) => Math.max(acc, v), l[0]);
}

export function min(l: number[]): number {
  return l.slice(1).reduce((acc, v) => Math.min(acc, v), l[0]);
}
