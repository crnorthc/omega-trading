import string
import random
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Friends
from .serializers import *
from rest_framework.response import Response
from .utils import *


class CreateUserView(APIView):
    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        choices = string.ascii_letters + string.digits
        while True:
            verification_code = ''.join(
                random.choice(choices) for i in range(6))
            queryset = User.objects.filter(verification_code=verification_code)
            if not queryset.exists():
                break
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        if 'username' in serializer.errors.keys():
            return Response({'Error': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            email = serializer.data.get('email')
            queryset_email = User.objects.filter(email=email)
            if queryset_email.exists():
                return Response({'Error': 'Email Taken'}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = User.objects.create_user(
                    username=username, email=email, password=password)
                user.first_name = first_name
                user.last_name = last_name
                user.verification_code = verification_code
                user.save()
                send_email_verification(email, username, verification_code)
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        else:
            return Response({'Error': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    serializer_class = LoginUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        username = serializer.data.get('username')
        password = serializer.data.get('password')
        user = authenticate(username=username, password=password)
        user_queryset = User.objects.filter(username=username)
        if not user_queryset.exists():
            return Response({'Error': 'Invalid Username'}, status=status.HTTP_400_BAD_REQUEST)
        if user is not None:
            if user.verification_code != '':
                return Response({"Error": "Verify Email"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            login(request, user)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        else:
            return Response({'Error': 'Invalid Password'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutUserView(APIView):
    def get(self, request, format=None):
        logout(request)
        return Response({"Success": "Logout Complete"}, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    serializer_class = UpdateUserSerializer

    def put(self, request, format=None):
        if not authenticate_request(request):
            return Response({'Error': 'User not Authenticated'},
                            status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({"Error": "Invalid Data"}, status=status.HTTP_400_BAD_REQUEST)
        first_name = serializer.data.get('first_name')
        last_name = serializer.data.get('last_name')
        old_username = serializer.data.get('old_username')
        new_username = serializer.data.get('new_username')
        queryset_username = User.objects.filter(username=old_username)
        if queryset_username.exists() and new_username != old_username:
            return Response({'Error': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)
        else:
            queryset = User.objects.filter(username=old_username)
            if not queryset.exists():
                return Response({"Error": "Something Went Wrong :("}, status=status.HTTP_409_CONFLICT)
            else:
                user = queryset[0]
                user.username = new_username
                user.first_name = first_name
                user.last_name = last_name
                user.save(update_fields=['username',
                                         'first_name', 'last_name'])
                return Response({"Success": "Update Complete"}, status=status.HTTP_200_OK)


class AddFriendView(APIView):
    serializer_class = FriendSerializer

    def patch(self, request, format=None):
        if not authenticate_request(request):
            Response({'Error': 'User not Authenticated'},
                     status=status.HTTP_403_FORBIDDEN)
        serializer = self.class_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"Error": "Invalid Data"}, status=status.HTTP_400_BAD_REQUEST)
        username = serializer.data.get('username')
        friend_username = serializer.data.get('friend')
        current_friends = Friends.objects.filter(username=username)
        if friend_username in current_friends:
            return Response({"Error": "Already Friends"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            user_queryset = User.objects.filter(username=username)
            user = user_queryset[0]
            friend_queryset = User.objects.filter(username=friend_username)
            friend = friend_queryset[0]
            friends = Friends(user=username, friend=friend)
            friends.save()
            return Response({"Success": "Friends Addded"}, status=status.HTTP_200_OK)
