module.exports.getOptionChain = async (index) => {
  try {
    const configs = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      },
    };
    const nseRes = await fetch(
      `${process.env.NSE_URL}?symbol=${index}`,
      configs
    );

    const nseObj = await nseRes.json();

    return nseObj;
  } catch (error) {
    console.error("option-chain.service getOtionChain | error: ", error);
    throw new Error(error);
  }
};
