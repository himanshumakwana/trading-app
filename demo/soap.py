import json
import requests
from bs4 import BeautifulSoup


symbol = 'NIFTY'

headers = {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0'}
url = 'https://www.nseindia.com/api/option-chain-indices?symbol=' + symbol

with requests.session() as s:

    # load cookies:
    s.get('https://www.nseindia.com/get-quotes/derivatives?symbol=' + symbol, headers=headers)

    # get data:
    data = s.get(url, headers=headers).json()

    # print data to screen:
    print(json.dumps(data, indent=4))
