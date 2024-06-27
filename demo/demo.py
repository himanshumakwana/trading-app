# from nsepython import *
# payload= nsefetch('https://www.nseindia.com/live_market/dynaContent/live_watch/option_chain/optionKeys.jsp?segmentLink=17&instrument=OPTIDX&symbol=BANKNIFTY')
# print(payload)
import json
from nsepythonserver import *

payload= nsefetch('https://nseindia.com/api/option-chain-indices?symbol=NIFTY')
print(json.dumps(payload))
