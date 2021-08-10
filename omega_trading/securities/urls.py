from django.urls import path
from .views import *

urlpatterns = [
    path('load', LoadSecurity.as_view()),
    path('search', SearchSymbols.as_view()),
    path('update', UpdateSecurity.as_view()),
    path('options', Options.as_view()),
    path('dates', ExpDates.as_view()),
    path('crypto-quote', CryptoQuote.as_view())
]
