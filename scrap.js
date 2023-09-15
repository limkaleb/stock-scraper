import axios from "axios"
import { load } from "cheerio"
import { createClient } from "redis"

const url = (company, type) =>
  `/findata-view/company/financial?symbol=${company}&data_type=1&report_type=1&statement_type=${type}`

// const url = '/symbol/MEDC/financials'

const refreshAccessToken = () => {
  console.log("refresh here...")
}

export default async (company, metric) => {
  console.log("selected company: ", company)
  console.log("selcted metric: ", metric)
  // Connect to redis
  const redisClient = createClient()
  redisClient.on("error", (err) => console.log("Redis Client Error", err))
  await redisClient.connect()
  const oldToken = await redisClient.get("stockbitToken")
  await redisClient.disconnect()

  const instance = axios.create({
    baseURL: "https://exodus.stockbit.com/",
    timeout: 1000,
    headers: {
      Authorization: "Bearer " + oldToken,
    },
  })

  const periods = []
  const eps = []
  const response = await instance.get(url(company, 1))

  const { html_report: html } = response.data.data
  const $ = load(html)
  const $table = $("table:first", html)
  const th = $("table:first").find("th.periods-list")

  th.each(function () {
    const period = $(this).text()
    periods.push(period)
  })

  // EPS
  const $eps = $(".formula1474", html)
  $eps.each((i, e) => {
    const ep = $(e).text()
    eps.push(ep)
  })

  // console.log('epss: ', eps)
  // ROE

  const q1 = {}
  const q2 = {}
  const q3 = {}
  const q4 = {}
  const total = {}

  // Calculate total
  periods.forEach((p, i) => {
    const [quarter, year] = p.split(" ")
    if (quarter === "Q1") {
      total[year] = Math.round(Number(eps[i])) || 0
      if (Number(eps[i])) {
        q1[year] = Math.round(Number(eps[i]))
      }
    } else if (quarter === "Q2") {
      total[year] = (total[year] += Math.round(Number(eps[i]))) || 0
      if (Number(eps[i])) {
        q2[year] = Math.round(Number(eps[i]))
      }
    } else if (quarter === "Q3") {
      total[year] = (total[year] += Math.round(Number(eps[i]))) || 0
      if (Number(eps[i])) {
        q3[year] = Math.round(Number(eps[i]))
      }
    } else if (quarter === "Q4") {
      total[year] =
        (total[year] += Math.round(Number(eps[i]))) ||
        (total[year] = Math.round(Number(eps[i])))
      if (Number(eps[i])) {
        q4[year] = Math.round(Number(eps[i]))
      }
    }
  })

  return {
    q1,
    q2,
    q3,
    q4,
    total,
  }
}

// main()
