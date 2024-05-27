const OptionChain = require("../models");

module.exports.nseOptionChainCaller = async (index) => {
  try {
    const nseRes = await fetch(`${process.env.NSE_URL}?symbol=${index}`);
    const response = await nseRes.json();

    return response;
  } catch (error) {
    console.error(
      Date.now(),
      " - nse option chain call failed ",
      JSON.stringify(error, null, 2)
    );
  }
};

module.exports.optionChainEntrier = async (response, indexModel) => {
  const expDates = response.records.expiryDates;
  const spot = response.records.underlyingValue;
  const ce_total_oi = response.filtered.CE.totOI;
  const pe_total_oi = response.filtered.PE.totOI;

  for (const expDate of expDates) {
    const ch = response.records.data.filter(
      (stk) => stk.expiryDate === expDate
    );

    for (const stk of ch) {
      const adjustment = (
        stk.strikePrice -
        (spot - (stk.CE.lastPrice - stk.PE.lastPrice).toFixed(2))
      ).toFixed(2);

      OptionChain[indexModel].create({
        expiry_dates: expDate,
        strike_price: stk.strikePrice,

        // CE info
        ce_io: stk.CE.openInterest,
        ce_chng_in_io: stk.CE.changeinOpenInterest,
        ce_ltp: stk.CE.lastPrice,

        // PE info
        pe_io: stk.PE.openInterest,
        pe_chng_in_io: stk.PE.changeinOpenInterest,
        pe_ltp: stk.PE.lastPrice,

        // analysis on CE and PE
        ltp_diff: stk.PE.lastPrice - stk.CE.lastPrice,
        adjustment: adjustment,
        chng_in_oi_diff:
          stk.CE.changeinOpenInterest - stk.PE.changeinOpenInterest,
        chng_in_oi_pcr:
          stk.PE.changeinOpenInterest / stk.CE.changeinOpenInterest,
        pcr: stk.PE.openInterest / stk.CE.openInterest,

        // overall pcr
        ce_total_oi: ce_total_oi,
        pe_total_oi: pe_total_oi,
        total_pcr: pe_total_oi / ce_total_oi,

        // whole response for future anaylsis purpose
        json_res: "nothing is here as of now",
      });
    }
  }
};
