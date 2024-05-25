const {
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_MSG,
  OKAY_CODE,
  BAD_REQUEST_CODE,
  INDEX_QUERY_NOT_FOUND,
} = require("../consts");
const { getOptionChain } = require("../services");

module.exports.getOptionChain = async (req, res, next) => {
  try {
    const index = req.query.index;

    if (!index) {
      res.status(BAD_REQUEST_CODE).json({ message: INDEX_QUERY_NOT_FOUND });
      return;
    }

    const optionChain = await getOptionChain(index);

    res.status(OKAY_CODE).json(optionChain);
    return;
  } catch (error) {
    console.error("error: ", error);
    res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};
