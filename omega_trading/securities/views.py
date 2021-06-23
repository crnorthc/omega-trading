from django.shortcuts import render
from rest_framework.response import Response
from requests import Request, get
from rest_framework import status
from rest_framework.views import APIView
from .TopSecret import *
from rest_framework.permissions import AllowAny
import requests

alpaca_endpoint = "https://data.alpaca.markets/v1/last/stocks/"


class SearchSymbols(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        search = request.data["search"]
        r = requests.get('https://finnhub.io/api/v1/search?q=' +
                         search + '&token='+FINNHUB_API_KEY)
        return Response(r.json(), status=status.HTTP_200_OK)


class GetLastTrade(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        symbol = request.data["symbol"]

        header = {'Content-Type': 'application/json',
                  'APCA-API-KEY-ID': APCA_API_KEY_ID,
                  'APCA-API-SECRET-KEY': APCA_API_SECRET_KEY}

        response = get(alpaca_endpoint + "/" + symbol, headers=header)

        print(response.json()['last']['price'])
        return Response({"SUCCESS": "SUCCESS"}, status=status.HTTP_200_OK)
