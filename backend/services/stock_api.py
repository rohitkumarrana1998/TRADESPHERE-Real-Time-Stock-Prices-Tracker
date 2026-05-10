import yfinance as yf
from flask import Blueprint, jsonify, request

stock_api = Blueprint("stock_api", __name__)

# Symbol mapping
symbols = {
    "NIFTY": "^NSEI",
    "BANKNIFTY": "^NSEBANK",
    "SENSEX": "^BSESN",
    "FINNIFTY": "NIFTY_FIN_SERVICE.NS"
}

@stock_api.route("/api/stock")
def get_stock():

    symbol = request.args.get("symbol")

    # mapping check
    ticker_symbol = symbols.get(symbol, symbol)

    try:
        stock = yf.Ticker(ticker_symbol)

        data = stock.history(period="1d")

        price = round(data["Close"].iloc[-1], 2)
        open_price = round(data["Open"].iloc[-1], 2)

        change = round(((price - open_price) / open_price) * 100, 2)

        return jsonify({
            "symbol": symbol,
            "price": price,
            "change": change
        })

    except Exception as e:

        return jsonify({
            "symbol": symbol,
            "price": None,
            "change": None,
            "error": str(e)
        })