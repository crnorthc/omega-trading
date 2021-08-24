from django.urls import path
from .views import *
from .player import *

urlpatterns = [
    path('create', Create.as_view()),
    path('load', Load.as_view()),
    path('join', Join.as_view()),
    path('leave', Leave.as_view()),
    path('remove', Remove.as_view()),
    path('decline', Decline.as_view()),
    path('invite', SendInvite.as_view()),
    path('start', StartGame.as_view()),
    path('buy', Buy.as_view()),
    path('sell', Sell.as_view()),
    path('history', GameHistory.as_view()),
    path('quote-ether', EtherQuote.as_view()),
    path('quote-gas', GasQuote.as_view()),
    path('define-contract', DefineContract.as_view()),
    path('start-bet', StartBets.as_view()),
    path('make-bet', MakeBet.as_view()),
    path('games', CurrentGames.as_view()),
    path('info/<str:room_code>/', GameInfo.as_view()),
    path('search', SearchGames.as_view()),
    path('populate', Populate.as_view()),
    path('play', PlayGame.as_view())
]
