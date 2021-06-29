from django.urls import path
from .views import*

urlpatterns = [
    path('load', LoadSecurity.as_view()),
    path('search', SearchSymbols.as_view()),
    path('update', UpdateSecurity.as_view()),
]
