import { JSDOM } from "jsdom";
import {
  ReitRankCsvLine,
  ReitHtmlMetric,
  ReitResultProps,
  ReitResultItemProps,
} from "./types.ts";
import { reitDividendResultsToMetrics } from "./transformers.ts";

export async function readReitRankCsv(
  path: string,
): Promise<{ [ticker: string]: ReitRankCsvLine }> {
  const data = await Deno.readTextFile(path);
  return data
    .split("\n")
    .map((l) => l.split(","))
    .reduce<{ ticker: string; score: number }[]>(
      (acc, v) => [...acc, { ticker: v[0], score: parseFloat(v[1]) }],
      [],
    )
    .reduce((acc, v) => ({ ...acc, [v.ticker]: v }), {});
}

export class ReitHtml {
  dom: JSDOM;

  constructor(html: string) {
    this.dom = new JSDOM(html);
  }

  static async load(path: string): Promise<ReitHtml> {
    return new ReitHtml(await Deno.readTextFile(path));
  }

  getMetrics(): ReitHtmlMetric[] {
    const value = this.dom.window.document
      .querySelector("#results")
      ?.getAttribute("value");
    if (value) {
      const data = JSON.parse(value);
      return data.map(reitDividendResultsToMetrics);
    } else {
      return [];
    }
  }
}

export async function readReitsJson(
  path: string,
): Promise<{ [ticker: string]: ReitResultItemProps }> {
  const text = await Deno.readTextFile(path);
  const data: ReitResultProps = JSON.parse(text);
  return data.list.reduce((acc, v) => ({ ...acc, [v.ticker]: v }), {});
}
