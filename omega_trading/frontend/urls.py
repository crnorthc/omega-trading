from django.urls import path
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
    path('create-game', index),
    path('game', index),
    path('games', index),
    path('search', index)
]
