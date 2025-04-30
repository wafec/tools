export function normalize(v: number, min: number, max: number): number {
  return (v - min) / (max - min);
}
