from django.urls import path
from .views import *

urlpatterns = [
    path('create', CreateUserView.as_view()),
    path('login', LoginUserView.as_view()),
    path('logout', LogoutUserView.as_view()),
    path('update', UpdateUserView.as_view()),
    path('add-friend', AddFriendView.as_view()),
    path('verify-email', VerifyEmailView.as_view()),
    path('reset-password', ResetPasswordView.as_view()),
    path('forgot-password', ForgotPasswordView.as_view()),
]
