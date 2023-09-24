import axios from "axios"
import { load } from "cheerio"
import { createClient } from "redis"
import constant from './constant.js'

export default async (company, type, metric) => {
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

  const net = []
  const eps = []
  const roe = []
  const per = []
  const pbv = []

  const url = constant.URL(company, constant.REPORT_TYPE[metric], 1)[type]
  // console.log('result of geturl: ', url)
  
  const response = await instance.get(url)

  // console.log('responseezz: ', response.data.data.closure_fin_items_results[0])

  if (type === 'info') {
    const metricMapping = {
      currentValuation: 0,
      perShare: 1,
      solvency: 2,
      managementEffectiveness: 3,
      profitability: 4,
      growth: 5,
      dividend: 6,
      incomeStatement: 8,
      balanceSheet: 9,
      cashflowStatement: 10,
    }

    const { closure_fin_items_results } = response.data.data
    const parsed = closure_fin_items_results.map((item) => {
      const { fin_name_results } = item
      return fin_name_results.map((result) => {
        return result.fitem
      })
    })
    // console.log('parsed: ', parsed[0])
    const result = parsed[metricMapping[metric]].map((curVal) => {
      return {
        key: curVal.name,
        value: curVal.value,
      }
    })
    return result
  } else if (type === 'financial') {
    console.log('metricc here: ', metric)
    const { html_report: html } = response.data.data
    const $ = load(html)
    const $table = $("table:first", html)
    const th = $("table:first").find("th.periods-list")
  
    th.each(function () {
      const period = $(this).text()
      periods.push(period)
    })
  
    const q1 = {}
    const q2 = {}
    const q3 = {}
    const q4 = {}
    const total = {}
    console.log('metricc: ', metric)
  
    switch (metric) {
      case "netIncome":
          // Net income
        const $net = $(".total-val-76", html)
        $net.each((i, p) => {
          const netIncome = $(p).text()
          net.push(netIncome) 
        })
        console.log('nettt: ', net)
        periods.forEach((p, i)=> {
          const [quarter, year] = p.split(" ")
          if (quarter === "Q1") {
            q1[year] = Number(net[i])
          } else if (quarter === "Q2") {
            q2[year] = Number(net[i])
          } else if (quarter === "Q3") {
            q3[year] = Number(net[i])
          } else if (quarter === "Q4") {
            q4[year] = Number(net[i])
          }
        })
      break
      case "roe":
        // ROE
        const $roe = $(".formula863", html)
        $roe.each((i, r) => {
          const returnOfEq = $(r).text()
          roe.push(returnOfEq)
        })
        periods.forEach((p, i)=> {
          const [quarter, year] = p.split(" ")
          if (quarter === "Q1") {
            q1[year] = roe[i]
          } else if (quarter === "Q2") {
            q2[year] = roe[i]
          } else if (quarter === "Q3") {
            q3[year] = roe[i]
          } else if (quarter === "Q4") {
            q4[year] = roe[i]
          }
        })
        break
      case "per":
          // PER
        const $per = $(".formula1482", html)
        $per.each((i, p) => {
          const priceEarn = $(p).text()
          per.push(priceEarn) 
        })
        periods.forEach((p, i)=> {
          const [quarter, year] = p.split(" ")
          if (quarter === "Q1") {
            q1[year] = Number(per[i])
          } else if (quarter === "Q2") {
            q2[year] = Number(per[i])
          } else if (quarter === "Q3") {
            q3[year] = Number(per[i])
          } else if (quarter === "Q4") {
            q4[year] = Number(per[i])
          }
        })
        break
        case "pbv":
          // PBV
        const $pbv = $(".formula1514", html)
        $pbv.each((i, p) => {
          const priceBook = $(p).text()
          pbv.push(priceBook) 
        })
        periods.forEach((p, i)=> {
          const [quarter, year] = p.split(" ")
          if (quarter === "Q1") {
            q1[year] = Number(pbv[i])
          } else if (quarter === "Q2") {
            q2[year] = Number(pbv[i])
          } else if (quarter === "Q3") {
            q3[year] = Number(pbv[i])
          } else if (quarter === "Q4") {
            q4[year] = Number(pbv[i])
          }
        })
        break
      case "eps":   
        // EPS
        const $eps = $(".formula1474", html)
        $eps.each((i, e) => {
          const ep = $(e).text()
          eps.push(ep)
        })
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
        break
      default:
        console.log('Sorry wrong metric!')
    }
  
    return {
      q1,
      q2,
      q3,
      q4,
      total,
    }
  }
}

// main()
