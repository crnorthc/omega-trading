from django.shortcuts import render
from rest_framework.response import Response
from requests import Request, get
from rest_framework import status
from rest_framework.views import APIView
from .TopSecret import *
from .utils import *
from rest_framework.permissions import AllowAny
import requests
import time
import math


class SearchSymbols(APIView):

    def post(self, request, format=None):
        search = request.data["search"]
        r = requests.get('https://finnhub.io/api/v1/search?q=' +
                         search + '&token='+FINNHUB_API_KEY[0])
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
