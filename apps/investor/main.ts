import fs from 'node:fs'
import { JSDOM } from 'jsdom'
import moment from 'moment'

const PRICE_OVER_PROPERTY = "P/VP"
const DY_CAGR_3_YEARS = "DY CAGR (3 anos)"

const AVAILABLE_INDICATORS: IndicatorName[] = [PRICE_OVER_PROPERTY, DY_CAGR_3_YEARS]

type IndicatorName = "P/VP" | "DY CAGR (3 anos)"

type Indicator = {
  name: IndicatorName
  value: string
  content: string
}

function getDom() {
  const data = fs.readFileSync("data.html")
  const html = data.toString()
  return new JSDOM(html)
}

function getIndicators(dom: JSDOM): Indicator[] {
  return dom.window.document.querySelectorAll("div.info").values().map<Indicator[]>((div) => {
    const indicators: Indicator[] = []
    for(const indicator of AVAILABLE_INDICATORS) {
      if (div.textContent?.includes(indicator)) {
        indicators.push( {
          name: indicator,
          content: div.textContent,
          value: getIndicatorValue(indicator, div.textContent)
        })
      }
    }
    return indicators
  }).flatMap(v => v).toArray()
}

function getIndicatorValue(indicatorName: IndicatorName, textContent: string): string {
  const i = textContent.indexOf(indicatorName)
  const potentialValue = textContent.substring(i + indicatorName.length).trim()
  const lines = potentialValue.split('\n')
  const parsedLines = lines.map(parseIndicatorValue).filter(v => v !== "")
  if (parsedLines.length > 0) {
    return parsedLines[0]
  }
  return ""
}

function parseIndicatorValue(indicatorValue: string): string {
    const v = parseFloat(indicatorValue.trim().replace('.', '').replace(",", "."))
    if (Number.isNaN(v)) {
      return ""
    }
    return v.toString()
}

type Interest = {
  date: Date
  value: string
}

function getInterestHistory(dom: JSDOM): Interest[] {
  const encoded = dom.window.document.querySelector("#results")?.getAttribute('value')
  const history: Interest[] = []
  if (encoded) {
    const data = JSON.parse(decodeURIComponent(encoded))
    for(const item of data) {
      history.push({
        date: moment(item.pd, "DD/MM/YYYY").toDate(),
        value: item.v
      })
    }
  }
  return history;
}

type InterestByMonthAndYear = {
  [month:number]: {[year:number]:Interest}
}

function groupInterestByMonth(history: Interest[]): InterestByMonthAndYear {
  const g: InterestByMonthAndYear = {}
  for (const interest of history) {
    if (!g[interest.date.getMonth()]) {
      g[interest.date.getMonth()] = {}
    }
    g[interest.date.getMonth()][interest.date.getFullYear()] = interest
  }
  return g;
}

function getRate(lastAmount: number, startAmount: number, t: number): number {
  return Math.pow(lastAmount / startAmount, 1/t) - 1
}

type Price = {
  price: number
  date: Date
}

type PriceHistoryProps = {
  prices: {price: number, date: string}[]
}

function getPrices(): Price[] {
  const data: PriceHistoryProps[] = JSON.parse(fs.readFileSync("tickerprice.json").toString())
  return data[0].prices.map(p => ({ price: p.price, date: moment(p.date, "DD/MM/YYYY HH:mm").toDate()}))
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const dom = getDom()
  getIndicators(dom).forEach(indicator => console.log(indicator.name, '=', indicator.value))
}
