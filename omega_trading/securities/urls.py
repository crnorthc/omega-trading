from django.urls import path
from .views import*

urlpatterns = [
    path('trades', GetLastTrade.as_view()),
    path('search', SearchSymbols.as_view())
]
