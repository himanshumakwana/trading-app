// const main = async () => {
//     const req = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY")

//     const res = await req.json()

//     console.log(JSON.stringify(res, null, 2))
// }

// main().then()

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors("*"))

app.use("/", async (req, res, next) => {
  const nseRes = await fetch("https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    }
  })
  const nseObj = await nseRes.json()

  res.send(nseObj)
})

app.listen(4000, () => {
  console.log("server is running on port 4000")
})
