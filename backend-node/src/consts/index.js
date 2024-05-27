const statusCodes = require("./status-code.const");
const statusMessage = require("./status-message.const");
const indexName = require("./index-name.const");

module.exports = {
  ...statusCodes,
  ...statusMessage,
  ...indexName,
};
