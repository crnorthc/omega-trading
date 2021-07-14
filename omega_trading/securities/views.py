from django.shortcuts import render
from rest_framework.response import Response
from requests import Request, get
from rest_framework import status
from rest_framework.views import APIView
from .TopSecret import *
from rest_framework.permissions import AllowAny
import requests
import time
import math

alpaca_endpoint = "https://data.alpaca.markets/v1/last/stocks/"


class SearchSymbols(APIView):
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        period = request.data["period"]
        symbol = request.data["symbol"]
        current_time = time.time()

        if period == "day":
            day = time.ctime()[:3]
            start_time = time.localtime()
            start_time = (start_time[0], start_time[1], start_time[2], 9,
                          00, 00, start_time[6], start_time[7], start_time[8])
            start_time = math.floor(time.mktime(start_time))
            resolution = "5"
            r = requests.get(
                'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=' + resolution + '&from=' + str(start_time) + '&to=' + str(math.floor(current_time)) + '&token=' + FINNHUB_API_KEY)
            r = r.json()
            while True:
                if r['s'] == "no_data":
                    start_time -= 86400
                    current_time = start_time + 32400
                    r = requests.get(
                        'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=' + resolution + '&from=' + str(start_time) + '&to=' + str(math.floor(current_time)) + '&token=' + FINNHUB_API_KEY)
                    r = r.json()
                else:
                    break
        else:
            start_time = time.localtime()
            start_time = (start_time[0], start_time[1], start_time[2], 9,
                          30, 00, start_time[6], start_time[7], start_time[8])
            start_time = math.floor(time.mktime(start_time))

            if period == "week":
                start_time = start_time - 604800
                resolution = "15"
            if period == "month":
                start_time = start_time - 2592000
                resolution = "60"
            if period == "3m":
                start_time = start_time - 7776000
                resolution = "D"
            if period == "y":
                start_time = start_time - 31536000
                resolution = "D"
            if period == "5y":
                start_time = start_time - 157680000
                resolution = "W"

        current_time = str(math.floor(current_time))
        start_time = str(start_time)

        r = requests.get(
            'https://finnhub.io/api/v1/stock/candle?symbol=' + symbol + '&resolution=' + resolution + '&from=' + start_time + '&to=' + current_time + '&token=' + FINNHUB_API_KEY)
        return Response(r.json(), status=status.HTTP_200_OK)


class UpdateSecurity(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        symbol = request.data["symbol"]

        r = requests.get(
            'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY)
        return Response(r.json(), status=status.HTTP_200_OK)
