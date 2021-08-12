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
<<<<<<< HEAD
    path('new-game', index),
=======
    path('join', index),
    path('game', index),
>>>>>>> bf3af1fa9705ae87d9ef9562c96b58aad848472c
    path('games', index),
    path('rules', index)
]
