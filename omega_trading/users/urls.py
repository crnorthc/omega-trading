from django.urls import path

from .views import CreateUserView, LoginUserView, LogoutUserView, UpdateUserView

urlpatterns = [
    path('create-user', CreateUserView.as_view()),
    path('login-user', LoginUserView.as_view()),
    path('logout-user', LogoutUserView.as_view()),
    path('update-user', UpdateUserView.as_view())
]
