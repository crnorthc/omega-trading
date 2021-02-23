from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import CreateUserSerializer, LoginUserSerializer, UpdateUserSerializer
from rest_framework.response import Response


class CreateUserView(APIView):
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            email = serializer.data.get('email')
            queryset_username = User.objects.filter(username=username)
            queryset_email = User.objects.filter(email=email)
            if queryset_username.exists():
                return Response({'Bad Request': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)
            elif queryset_email.exists():
                return Response({'Bad Request': 'Email Taken'}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = User.objects.create_user(
                    username=username, email=email, password=password)
                user.first_name = first_name
                user.last_name = last_name
                user.save()
        else:
            return Response({'Bad Request': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    serializer_class = LoginUserSerializer

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        username = serializer.data.get('username')
        password = serializer.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
        else:
            return Response({'Bad Request': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutUserView(APIView):
    def patch(self, request, format=None):
        logout(request)


class UpdateUserView(APIView):
    serializer_class = UpdateUserSerializer

    def put(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        first_name = serializer.data.get('first_name')
        last_name = serializer.data.get('last_name')
        old_username = serializer.data.get('old_username')
        new_username = serializer.data.get('new_username')
        queryset_username = User.objects.filter(username=old_username)
        if queryset_username.exists():
            return Response({'Bad Request': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)
        else:
            queryset = User.objects.filter(username=old_username)
            if not queryset.exists():
                return Response({"Internal Error": "Something Went Wrong :("}, status=status.HTTP_409_CONFLICT)
            else:
                user = queryset[0]
                user.username = new_username
                user.first_name = first_name
                user.last_name = last_name
                user.save(update_fields=['username',
                                         'first_name', 'last_name'])
                return Response({"Successful": "Update Complete"}, status=status.HTTP_200_OK)
