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
    path('color', SetColor.as_view()),
    path('history', GameHistory.as_view()),
    path('edit', EditGame.as_view()),
    path('quote-ether', EtherQuote.as_view()),
    path('quote-gas', GasQuote.as_view()),
    path('define-contract', DefineContract.as_view()),
    path('start-bet', StartBets.as_view()),
    path('make-bet', MakeBet.as_view()),
    path('games', CurrentGames.as_view()),
    path('info/<str:room_code>/', GameInfo.as_view())
]
