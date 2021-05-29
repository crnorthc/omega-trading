from django.urls import path
from .views import*

urlpatterns = [
    path('search', SearchSymbolView.as_view()),
    path('trades', GetLastTrade.as_view())
]
