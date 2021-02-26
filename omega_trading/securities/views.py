from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .symbols import TickerSymbols


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
                    print(symbols_to_return)
                    return Response(symbols_to_return, status=status.HTTP_200_OK)
        print(symbols_to_return)
        return Response(symbols_to_return, status=status.HTTP_200_OK)
