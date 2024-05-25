const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");

const routers = require("./routers");

const app = express();

app.use(cors("*"));
dotenv.config();

app.use("/option-chain", routers.optionChainRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
