const express = require("express");
const router = express.Router();

const controller = require("../controllers");

router.get("/list", controller.getOptionChain);

module.exports = router;
