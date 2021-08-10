from django.shortcuts import render
from rest_framework.response import Response
from requests import Request, get
from rest_framework import status
from rest_framework.views import APIView
from .TopSecret import *
from .utils import *
from .options import get_price
from rest_framework.permissions import AllowAny
import requests



class SearchSymbols(APIView):

    def post(self, request, format=None):
        search = request.data["search"]
        r = requests.get('https://finnhub.io/api/v1/search?q=' +
                         search + '&token='+FINNHUB_API_KEY)
        r = r.json()

        values = []
        count = 0

        while True:
            if len(search) == 0:
                break
            for result in r['result']:
                if len(values) >= 6:
                    break
                if result['description'].lower().startswith(search):
                    values.append(result)
                if result['symbol'].lower().startswith(search):
                    values.append(result)
            search = search[:-1]
        
        return Response(values, status=status.HTTP_200_OK)


class LoadSecurity(APIView):

    def post(self, request, format=None):
        period = request.data["period"]
        symbol = request.data["symbol"]
        
        start, end, resolution = get_period(period)

        r = requests.get(
            'https://finnhub.io/api/v1/stock/candle?symbol=' + symbol + '&resolution=' + resolution + '&from=' + start + '&to=' + end + '&token=' + FINNHUB_API_KEY)
        
        path, periods = format_data_for_svg(r.json(), period, 676, 250)
        
        return Response({"Success": {'path': path, 'periods': periods}}, status=status.HTTP_200_OK)


class UpdateSecurity(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        symbol = request.data["symbol"]

        r = requests.get(
            'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY)
        return Response(r.json(), status=status.HTTP_200_OK)


class Options(APIView):

    def post(self, request, format=None):
        symbol = request.data['symbol']
        expiration = request.data['expiration'] # in days        
        type = request.data['type']

        if expiration == None:
            expiration = this_friday(time.time(), True)

        current_price = get_quote(symbol)
        price_range = strike_price_range(current_price)
        div = div_yield(symbol)

        prices = []

        for strike in price_range:
            price = get_price(type, div, strike, current_price, expiration)
            prices.append({
                'strike': strike,
                'price': price
            })

        return Response({"options": prices}, status=status.HTTP_200_OK)


class ExpDates(APIView):

    def post(self, request, format=None):        
        print(time.time())
        formatted_date, timestamp = format_date(time.time())
        dates = []

        dates.append(formatted_date)
        
        for i in range(1, 7):
            formatted_date, _ = format_date(timestamp + (i * SECONDS_IN_WEEK))
            dates.append(formatted_date)

        formatted_date, timestamp = friday_two_months(timestamp)

        dates.append(formatted_date)

        for i in range(3, 5):
            formatted_date, timestamp = friday_next_month(timestamp)
            dates.append(formatted_date)

        for i in range (1, 3):
            timestamp += SECONDS_IN_YEAR
            dates.extend(get_months(timestamp))

        return Response({"dates": dates}, status=status.HTTP_200_OK)


class CryptoQuote(APIView):

    def post(self, request, format=None):
        symbol = request.data['symbol']

        r = requests.get(
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=' + CRYPTO_KEY + '&symbol=' + symbol)

        r = r.json()
        time = r['status']['timestamp'][11:16]

        if int(time[0:2]) - 4 > 12:
            time = ' ' + str(int(time[0:2]) - 16) + time[2:] + " PM"
        else:
            if int(time[0:2]) >= 0 and int(time[0:2]) <= 4:
                time = ' ' + str(8 + int(time[0:2])) + time[2:] + ' PM'
            else:
                time = ' ' + str((int(time[0:2]) - 4)) + time[2:] + ' AM'

        quotes = {}

        for symbol, value in r['data'].items():
            quotes[symbol] = value['quote']['USD']['price']

        quotes['time'] = time

        return Response({"quotes": quotes}, status=status.HTTP_200_OK)