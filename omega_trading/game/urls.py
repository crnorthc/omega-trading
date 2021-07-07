from django.urls import path
from .views import *

urlpatterns = [
    path('start', StartGame.as_view()),
    path('load', LoadGame.as_view()),
    path('join', JoinGame.as_view()),
    path('invite', SendInvite.as_view())
]
