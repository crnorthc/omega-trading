from django.urls import path
from .views import *

urlpatterns = [
    path('create', CreateUser.as_view()),
    path('login', Login.as_view()),
    path('logout', Logout.as_view()),
    path('update', UpdateUsername.as_view()),
    path('verify-email', VerifyEmail.as_view()),
    path('forgot-password', ForgotPassword.as_view()),
    path('reset-forgot-password', ResetPassword.as_view()),
    path('load', LoadUser.as_view()),
    path('search-user', SearchUsers.as_view()),
    path('invite', SendInvite.as_view()),
    path('accept', AcceptInvite.as_view()),
]
