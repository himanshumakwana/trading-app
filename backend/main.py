from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample data (usually you'd have a database)
books = [
    {"id": 1, "title": "Book 1", "author": "Author 1"},
    {"id": 2, "title": "Book 2", "author": "Author 2"},
    {"id": 3, "title": "Book 3", "author": "Author 3"}
]

# GET method to retrieve all books
@app.route('/books', methods=['GET'])
def get_books():
    return jsonify(books)


# GET method to retrieve all books
@app.route('/option-chain/list', methods=['GET'])
def getOptionChainList():
    index = request.args.get("index")

    url_oc = "https://www.nseindia.com/option-chain"

    sess = requests.Session()
    cookies = dict()
    
    request = sess.get(url_oc, headers=headers)
    cookies = dict(request.cookies)
    print("cookies set successfully")

    
    headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36', 'accept-language': 'en,gu;q=0.9,hi;q=0.8', 'accept-encoding': 'gzip, deflate, br'}
    url = f'https://www.nseindia.com/api/option-chain-indices?symbol={index}'
    # response = requests.get(url, headers = headers)
    response = sess.get(url, headers=headers, cookies=cookies)


    if response.status_code == 200:
        return response.json()
    else:
        return f"Error: Failed to fetch data, status code: {response.status_code}", 500


# GET method to retrieve a specific book
@app.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = next((book for book in books if book['id'] == id), None)
    if book:
        return jsonify(book)
    else:
        return jsonify({'message': 'Book not found'}), 404

# POST method to add a new book
@app.route('/books', methods=['POST'])
def add_book():
    data = request.json
    books.append(data)
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)
