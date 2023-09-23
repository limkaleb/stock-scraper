import * as p from "@clack/prompts"
import chalk from "chalk"
import scrap from "./scrap.js"
// import constant from "./constant.js"

const formatTable = (data) => {
  console.log('data: ', data)
  console.log('data length: ', Object.keys(data.q1))
  // const headers = chalk.bold.blueBright.bgGreenBright.underline(Object.keys(data.q1)[0]) + "\t" + chalk.bold.cyanBright.underline("Age");
  const headers = Object.keys(data.q1)
  console.log('headers: ', headers)
}

const infoOpts = [
  { value: 'currentValuation', label: 'Current Valuation' },
  { value: 'perShare', label: 'Per Share' },
  { value: 'solvency', label: 'Solvency' },
  { value: 'managementEffectiveness', label: 'Management Effectiveness' },
  { value: 'profitability', label: 'Profitability' },
  { value: 'growth', label: 'Growth' },
  { value: 'dividend', label: 'Dividend' },
  { value: 'incomeStatement', label: 'Income Statement'},
  { value: 'balanceSheet', label: 'Balance Sheet'},
  { value: 'cashflowStatement', label: 'Cashflow Statement'},
  
]

const financialOpts = [
  { value: 'netIncome', label: 'Net Income' },
  { value: 'eps', label: 'Earning Per Share' },
  { value: 'roe', label: 'Return on Equity' },
  { value: 'per', label: 'Price to Earn Ratio' },
  { value: 'pbv', label: 'Price to Book Value' },
]

async function main() {
  p.intro(chalk.blue.bold("Welcome to Stockbit!"))

  const company = await p.text({
    message: "Company:",
    initialValue: "",
    validate(value) {
      if (value.length === 0) return `Value is required!`
    },
  })

  const type = await p.select({
    message: 'Pick a metric.',
    options: [
      { value: 'info', label: 'Info' },
      { value: 'financial', label: 'Financial' },
    ],
  });

  const metric = await p.select({
    message: 'Pick a metric.',
    options: type === 'info' ? infoOpts : financialOpts 
  });

  const s = p.spinner()
  s.start()

  try {
    const res = await scrap(company, type, metric)
    s.stop()

    console.group('\n')
    console.log(chalk.yellow.bold(company.toUpperCase()))

    if (type === 'info') {
      // console.log(res)
      const transformed = res.map((item) => {
        console.log(chalk.blue(item.key) + ': ' + chalk.green.bold(item.value))
      })
    } else {
      console.log('here')
      console.table(res)
    }

    console.group('\n')

    // p.outro(chalk.greenBright.bold(res))
  } catch (err) {
    s.stop()
  }
}

main()
