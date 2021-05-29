from django.shortcuts import render
from rest_framework.response import Response
from requests import Request, get
from rest_framework import status
from rest_framework.views import APIView
from .symbols import TickerSymbols
from .TopSecret import *
from rest_framework.permissions import AllowAny

alpaca_endpoint = "https://data.alpaca.markets/v1/last/stocks/"


class SearchSymbolView(APIView):
    def get(self, request, format=None):
        symbol = 'aad'.upper()
        count = 0
        symbols_to_return = []
        for i in TickerSymbols:
            if len(i['symbol']) >= len(symbol):
                print(i['symbol'][0:len(symbol)])
                if i['symbol'][0:len(symbol)] == symbol or i['name'][0:len(symbol)].upper() == symbol:
                    symbols_to_return.append(i)
                    count += 1
                if count == 10:
                    return Response(symbols_to_return, status=status.HTTP_200_OK)
        return Response(symbols_to_return, status=status.HTTP_200_OK)


class GetLastTrade(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        symbol = request.data["symbol"]

        header = {'Content-Type': 'application/json',
                  'APCA-API-KEY-ID': APCA_API_KEY_ID,
                  'APCA-API-SECRET-KEY': APCA_API_SECRET_KEY}

        response = get(alpaca_endpoint + "/" + symbol, headers=header)

        print(response.json()['last']['price'])
        return Response({"SUCCESS": "SUCCESS"}, status=status.HTTP_200_OK)
