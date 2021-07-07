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
    path('portfolio', index),
    path('lobby', index)
]
