from flask import Flask, jsonify, request
from flask_cors import CORS
from nsepythonserver import *
from sqlite import OptionChainNifty


app = Flask(__name__)
CORS(app)

# GET method to retrieve all books
@app.route('/health', methods=['GET'])
def get_books():
    return jsonify("this is health point and if you are seeing this message that means server is healthy")

# GET method to retrieve all books
@app.route('/option-chain/list', methods=['GET'])
def getOptionChainList():
    index = request.args.get("index")
    
    url = f'https://www.nseindia.com/api/option-chain-indices?symbol={index}'
    print(url)

    response = nsefetch(url)
    return response

@app.route('/option-chain/chart', methods=['POST'])
def getChartDetails():
    body = request.json
    # index = request.args.get("index")

    expiry_dates = body.get("expiry_dates")
    strike_price = body.get("strike_price")

    print(expiry_dates, strike_price)

    option_data = OptionChainNifty.select().where(
        OptionChainNifty.expiry_dates == expiry_dates, 
        OptionChainNifty.strike_price == strike_price
    ).dicts()

    return jsonify({ f"{expiry_dates}": { f"{strike_price}": list(option_data) } })

if __name__ == '__main__':
    app.run(debug=True)
