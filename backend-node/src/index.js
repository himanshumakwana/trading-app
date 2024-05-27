// npm module imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");

// internal file imports
const routers = require("./routers");
const configs = require("./configs");
const consts = require("./consts");
const utils = require("./utils");

// consts/variables
const app = express();

// configs
app.use(cors("*"));
dotenv.config();

// Sync the models with the database
configs.sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// routes
app.use("/option-chain", routers.optionChainRoute);

// crons
cron.schedule("* 9-14 * * 0-5", async () => {
  const result = await Promise.allSettled(
    consts.INDEXES.map(async (index) => ({
      ...(await utils.nseOptionChainCaller(index)),
      index,
    }))
  );
  await Promise.allSettled(
    result.map(async (statusObj) => {
      console.log("inserting in index data of ", statusObj);
      await utils.optionChainEntrier(
        statusObj.value,
        consts.INDEX_TABLES[statusObj.value.index]
      );
    })
  );
});

// server listening with PORT
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
