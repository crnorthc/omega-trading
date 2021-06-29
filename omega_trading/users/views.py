from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Profile, Friends
from .serializers import *
from rest_framework.response import Response
from .utils import *
from rest_framework.permissions import AllowAny
import time
import math


class CreateUserView(APIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        verification_code = get_verification_code()
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
                profile = Profile(
                    verification_code=verification_code, user=user)
                user.save()
                profile.save()
                send_email_verification(email, username, verification_code)
                return Response({"Success": "Verification Email Sent"}, status=status.HTTP_200_OK)
        else:
            return Response({'Error': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        print(request.data)
        serializer.is_valid()
        print(serializer.errors)
        if serializer.is_valid():
            verification_code = serializer.data.get('verification_code')
            return verify_user(verification_code)
        return Response({'Error': 'Invalid Verification Code'}, status=status.HTTP_200_OK)


class LoginUserView(APIView):
    serializer_class = LoginUserSerializer
    permission_classes = [AllowAny]

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
            profile = Profile.objects.filter(user_id=user.id)[0]
            if profile.verification_code != 'auth':
                return Response({"Error": "Verify Email"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            login(request, user)
            token = Token.objects.filter(user_id=user.id)
            return set_cookie(token[0].key)
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


class CheckResetView(APIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        print(serializer.data)
        print(serializer.errors)
        if serializer.is_valid():
            reset_code = serializer.data.get("verification_code")
            queryset = Profile.objects.filter(verification_code=reset_code)
            if not queryset.exists():
                return Response({"Error": "Reset Code Failed"}, status=status.HTTP_200_OK)
            profile = queryset[0]
            profile.verification_code = "auth"
            profile.save()
            return Response({"Success": "Reset Code Checked"}, status=status.HTTP_200_OK)
        return Response({"Error": "Reset Code Failed"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        queryset = User.objects.filter(username=username)
        if not queryset.exists():
            return Response({"Error": "Invalid Username"}, status=status.HTTP_200_OK)
        user = queryset[0]
        user.set_password(password)
        user.save()
        return Response({"Success": "Password Changed"}, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({"Error": "Invalid Email"}, status=status.HTTP_200_OK)
        email = serializer.data.get('email')
        queryset = User.objects.filter(email=email)
        if not queryset.exists():
            return Response({"Error": "Invalid Email"}, status=status.HTTP_200_OK)
        user = queryset[0]
        return send_password_reset(user)


class AddFriendView(APIView):
    serializer_class = FriendSerializer

    def patch(self, request, format=None):
        if not authenticate_request(request):
            Response({'Error': 'User not Authenticated'},
                     status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(data=request.data)
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


class Buy(APIView):

    def post(self, request, format=None):
        symbol, quantity, quote, profile, add, start_time = transaction(
            request, True)
        if (quote['c'] * quantity) > profile.portfolio_amount:
            return Response({"Error": "Not Enough Funds"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        profile.portfolio_amount = profile.portfolio_amount - \
            (quote['c'] * quantity)
        if str(start_time) in profile.transactions:
            profile.transactions[str(start_time)].append(add)
        else:
            profile.transactions[str(start_time)] = [add]
        holdings = profile.holdings
        if symbol in holdings:
            holdings[symbol] = holdings[symbol] + quantity
        else:
            holdings[symbol] = quantity
        profile.holdings = holdings
        profile.save()
        return load_user(request)


class Sell(APIView):

    def post(self, request, format=None):
        symbol, quantity, quote, profile, add, start_time = transaction(
            request, False)

        profile.portfolio_amount = profile.portfolio_amount + \
            (quote['c'] * quantity)

        if str(start_time) in profile.transactions:
            profile.transactions[str(start_time)].append(add)
        else:
            profile.transactions[str(start_time)] = [add]

        holdings = profile.holdings
        holdings[symbol] = holdings[symbol] - quantity
        profile.save()
        return load_user(request)


class LoadUser(APIView):

    def post(self, request, format=None):
        return load_user(request)


class LoadUserPortfolio(APIView):

    def post(self, request, format=None):
        period = request.data["period"]
        current_time = time.time()

        if period == "day":
            day = time.ctime()[:3]
            start_time = time.localtime()
            start_time = (start_time[0], start_time[1], start_time[2], 9,
                          00, 00, start_time[6], start_time[7], start_time[8])
            start_time = math.floor(time.mktime(start_time))
            if day == "Sun":
                start_time -= (86400 * 2)
                current_time = start_time + 32400
            elif day == "Sat":
                start_time -= 86400
                current_time = start_time + 32400
            resolution = "5"
        else:
            start_time = time.localtime()
            start_time = (start_time[0], start_time[1], start_time[2], 9,
                          30, 00, start_time[6], start_time[7], start_time[8])
            start_time = math.floor(time.mktime(start_time))

            if period == "week":
                start_time = start_time - 604800
                resolution = "15"
            if period == "month":
                start_time = start_time - 2592000
                resolution = "60"
            if period == "3m":
                start_time = start_time - 7776000
                resolution = "D"
            if period == "y":
                start_time = start_time - 31536000
                resolution = "D"
            if period == "5y":
                start_time = start_time - 157680000
                resolution = "W"
