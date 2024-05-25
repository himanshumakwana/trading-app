const statusCodes = require("./status-code.const");
const statusMessage = require("./status-message.const");

module.exports = {
  ...statusCodes,
  ...statusMessage,
};
