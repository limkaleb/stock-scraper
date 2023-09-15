import { createClient } from "redis"

const client = createClient()

client.on("error", (err) => console.log("Redis Client Error", err))

await client.connect()
console.log("connected to redis..")

const oldValue = await client.get("stockbitToken")
console.log("old value: ", oldValue)

const currentToken =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU3MDc0NjI3LTg4MWItNDQzZC04OTcyLTdmMmMzOTNlMzYyOSIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZSI6ImxpbWthbGViIiwiZW1hIjoibGlta2FsZWJAZ21haWwuY29tIiwiZnVsIjoia2FsZWIiLCJzZXMiOiJ0dGxuMWNlTTVVdlJXcUlDIiwiZHZjIjoiIiwidWlkIjoxNTUxNTB9LCJleHAiOjE2OTQ0MTEwMDcsImlhdCI6MTY5NDMyNDYwNywiaXNzIjoiU1RPQ0tCSVQiLCJqdGkiOiIzN2UzNDNjZi05NDUzLTRjN2UtODFlYy1iNDA4OTRjZjA1OGYiLCJuYmYiOjE2OTQzMjQ2MDd9.vh5OzDvnIeuxaqTqI6NVLA_iu54gzJzO2n4o12R3itIqvEe1BMl3lLJzHCIvQAte5ah9FfSVoZpXS1Wk6rSj9hGB7ANcLC7zy3BmBFEy_fVVXVG7-hGbQK-I0T7DgvdXIKc5JhEQ4o2ABqg7xXDTxjGNTBAqNejYazU4c7__JjiZT9MOV3T4uW7LzZQR8iwDXHi-VfhnsB3uFudybaVxyM-mFEgeqNMAp59Gd1P_3U8paCqfRhj5nx-kWSVxtJSdivgzmP25pudo549MWV7TMqm4afM3WR3K7bZUtHjzs0nY3V2z6BNsX60GUuKOMXwKvvigQpJXoFACQREbJxz5NQ"

await client.set("stockbitToken", currentToken)
const value = await client.get("stockbitToken")
console.log("value: ", value)
