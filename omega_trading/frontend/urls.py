from django.urls import path
from django.urls.conf import re_path, path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('login', index),
    path('sign-up', index),
    path('verify-account', index),
    path('reset-password', index),
    path('forgot-password', index),
    path('chart', index),
    path('account', index),
    path('new-game', index),
    path('join-game', index),
    path('game-mode', index),
    path('normal-mode', index),
    path('game-length', index),
    path('short-game', index),
    path('long-game', index),
    path('tournament-mode', index),
    path('game', index),
    path('games', index),
    path('search', index),
    re_path(r'^games/*.', index)
]
