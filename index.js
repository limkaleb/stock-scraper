import * as p from "@clack/prompts"
import chalk from "chalk"
import { createClient } from "redis"
import { setTimeout } from "node:timers/promises"
import scrap from "./scrap.js"
import constant from "./constant.js"

async function main() {
  p.intro(chalk.blue.bold("Welcome to Stockbit!"))

  const company = await p.text({
    message: "Company:",
    initialValue: "",
    validate(value) {
      if (value.length === 0) return `Value is required!`
    },
  })

  const metric = await p.text({
    message: "Metric:",
    initialValue: "",
    validate(value) {
      if (value.length === 0) return `Value is required!`
    },
  })

  const s = p.spinner()
  s.start()

  try {
    const res = await scrap(company, metric)
    // console.log("ress: ", res)

    s.stop()

    // showing result
    console.table(res)
    p.outro(chalk.greenBright.bold("finish!"))
  } catch (err) {
    s.stop()
  }
}

main()
