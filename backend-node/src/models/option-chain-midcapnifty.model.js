const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs");

const OptionChainMidcap = sequelize.define("option-chain-midcapnifty", {
  // general
  expiry_dates: DataTypes.STRING,
  strike_price: DataTypes.INTEGER.UNSIGNED,

  // CE info
  ce_io: DataTypes.DECIMAL,
  ce_chng_in_io: DataTypes.DECIMAL,
  ce_ltp: DataTypes.DECIMAL,

  // PE info
  pe_io: DataTypes.DECIMAL,
  pe_chng_in_io: DataTypes.DECIMAL,
  pe_ltp: DataTypes.DECIMAL,

  // analysis on CE and PE
  ltp_diff: DataTypes.DECIMAL,
  adjustment: DataTypes.DECIMAL,
  chng_in_oi_diff: DataTypes.DECIMAL,
  chng_in_oi_pcr: DataTypes.DECIMAL,
  pcr: DataTypes.DECIMAL,

  // overall pcr
  ce_total_oi: DataTypes.DECIMAL,
  pe_total_oi: DataTypes.DECIMAL,
  total_pcr: DataTypes.DECIMAL,

  // whole response for future anaylsis purpose
  json_res: DataTypes.TEXT("long"),
});

module.exports = OptionChainMidcap;
