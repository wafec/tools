export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function randomSleep(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.random() * (maxMs - minMs) + minMs;
  return sleep(ms);
}
