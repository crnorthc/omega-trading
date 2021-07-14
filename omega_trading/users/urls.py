from django.urls import path
from .views import *

urlpatterns = [
    path('create', CreateUserView.as_view()),
    path('login', LoginUserView.as_view()),
    path('autoLogin', AutoLogin.as_view()),
    path('logout', LogoutUserView.as_view()),
    path('update', UpdateUserView.as_view()),
    path('verify-email', VerifyEmailView.as_view()),
    path('forgot-password', ForgotPasswordView.as_view()),
    path('reset-forgot-password', ResetPasswordView.as_view()),
    path('check-reset-code', CheckResetView.as_view()),
    path('buy', Buy.as_view()),
    path('sell', Sell.as_view()),
    path('load', LoadUser.as_view()),
    path('portfolio', LoadPortfolio.as_view()),
    path('search-user', SearchUsers.as_view()),
    path('invite', SendInvite.as_view()),
    path('accept', AcceptInvite.as_view()),
    path('history', SaveHistory.as_view()),
    path('leaderboard', Leaderboard.as_view())
]
