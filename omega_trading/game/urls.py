from django.urls import path
from .views import *

urlpatterns = [
    path('create', CreateGame.as_view()),
    path('load', LoadGame.as_view()),
    path('join', JoinGame.as_view()),
    path('invite', SendInvite.as_view()),
    path('start', StartGame.as_view()),
    path('buy', Buy.as_view()),
    path('sell', Sell.as_view()),
    path('color', SetColor.as_view())
]
