import axios from "axios"
import { createClient } from "redis"

const instance = axios.create({
  baseURL: "https://stockbit.com/api/",
  timeout: 1000,
})

export default async function main() {
  const response = await instance.post("/login/email", {
    username: "limkaleb@gmail.com",
    password: "Born041091",
  })

  const { access } = response.data.data

  const redisClient = createClient()
  redisClient.on("error", (err) => console.log("Redis Client Error", err))
  await redisClient.connect()
  await redisClient.set("stockbitToken", access.token)
  await redisClient.disconnect()
  console.log("access token set: ", access.token)
}

main()
