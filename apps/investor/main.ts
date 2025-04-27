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

function calculateInterestDiff(g: InterestByMonthAndYear, intervalMonths: number, intervalYears: number): number {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  let lookupMonths = [...Array(1 + currentMonth - (Math.max(0, currentMonth - intervalMonths))).keys()].map(v => v + Math.max(0, currentMonth - intervalMonths))
  if (lookupMonths.length < intervalMonths + 1) {
    lookupMonths = [...lookupMonths, ...Array(intervalMonths - lookupMonths.length + 1).keys().map(v => v + 12 - (intervalMonths - lookupMonths.length + 1))]
  }
  const lookupYears = [...Array(intervalYears + 2).keys().map(v => v + currentYear - intervalYears - 1)]
  console.log(lookupMonths, lookupYears)
  let sumTotal = 0
  for (const month of lookupMonths) {
    let sumMonth = 0
    let yearCount = 0
    for (let i = lookupYears.length - 1; i > 0 && yearCount < intervalYears + 1; i--) {
      if (!g[month][lookupYears[i]]) {
        continue
      }
      sumMonth += (parseFloat(g[month][lookupYears[i]].value) - parseFloat(g[month][lookupYears[i - 1]].value))
      yearCount++
    }
    sumTotal += sumMonth
  }
  return sumTotal
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const dom = getDom()
  getIndicators(dom).forEach(indicator => console.log(indicator.name, '=', indicator.value))
  console.log('Interest History')
  console.log(calculateInterestDiff(groupInterestByMonth(getInterestHistory(dom)), 11, 0))
}
