from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import *
from .TopSecret import *
from .serializers import *
from rest_framework.response import Response
from .utils import *
from rest_framework.permissions import AllowAny
from django.db.models import Q
import time
import math
import requests
import string
import json


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

            user = User.objects.create_user(
                username=username, email=email, password=password, first_name=first_name, last_name=last_name)
            profile = Profile(
                verification_code=verification_code, user=user)

            current_day = time.localtime()
            current_day = (current_day[0], current_day[1], current_day[2], 1,
                           00, 00, current_day[6], current_day[7], current_day[8])
            current_day = math.floor(time.mktime(current_day)) - SECONDS_IN_DAY

            transaction = Transaction(bought=True, symbol='', quantity=0, price=0, time=round(current_day, 5), cash=25000, total_quantity=0, profile=profile)

            user.save()
            profile.save()
            transaction.save()

            send_email_verification(email, username, verification_code)

            return Response({"Success": "Verification Email Sent"}, status=status.HTTP_200_OK)
        else:
            return Response({'Error': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    serializer_class = VerifyEmailSerializer
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()

        if serializer.is_valid():
            verification_code = serializer.data.get('verification_code')
            return verify_user(verification_code)
        else:
            return Response({'Error': 'Invalid Verification Code'}, status=status.HTTP_200_OK)


class AutoLogin(APIView):

    def post(self, request, format=None):
        login(request, request.user)

        token = Token.objects.filter(user_id=request.user.id)
        headers = set_cookie(token[0].key)
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        path = profile.latest_path

        return Response({"Success": path}, headers=headers,
                        status=status.HTTP_200_OK)


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
            headers = set_cookie(token[0].key)
            return Response({"Success": "User Logged In"}, headers=headers,
                            status=status.HTTP_200_OK)
        else:
            return Response({'Error': 'Invalid Password'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutUserView(APIView):

    def post(self, request, format=None):
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        profile.latest_path = '/'
        profile.save()
        logout(request)

        return Response({"Success": "Logout Complete"}, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    serializer_class = UpdateUserSerializer

    def put(self, request, format=None):
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
            user = User.objects.filter(username=old_username)
            user = user[0]
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
        user = User.objects.filter(email=email)

        if not user.exists():
            return Response({"Error": "Invalid Email"}, status=status.HTTP_200_OK)

        return send_password_reset(user[0])


class Buy(APIView):

    def post(self, request, format=None):
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        symbol, quantity, quote, Transaction = transaction(
            request, True, profile)

        if (quote['c'] * quantity) > profile.cash:
            return Response({"Error": "Not Enough Funds"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if request.data['dollars']:
            profile.cash = profile.cash - \
                request.data['quantity']
        else:
            profile.cash = profile.cash - \
                (quote['c'] * quantity)

        holdings = Holdings.objects.filter(profile_id=profile.id, symbol=symbol)
        if holdings.exists():
            holdings = holdings[0]
            holdings.quantity += quantity
        else:
            holdings = Holdings(symbol=symbol, quantity=quantity, profile=profile)


        Transaction.total_quantity = holdings.quantity

        profile.save()
        Transaction.save()
        holdings.save()

        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class Sell(APIView):

    def post(self, request, format=None):
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        symbol, quantity, quote, Transaction = transaction(
            request, False, profile)

        holdings = Holdings.objects.filter(profile_id=profile.id, symbol=symbol)

        if not holdings.exists():
            return Response({"Error": "No Shares Held"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            holdings = holdings[0]

        if quantity > holdings.quantity:
            return Response({"Error": "Not Enough Shares"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if request.data['dollars']:
            profile.cash = profile.cash + \
                request.data['quantity']
        else:
            profile.cash = profile.cash + \
                (quote['c'] * quantity)

        holdings.quantity -= quantity

        Transaction.total_quantity = holdings.quantity

        profile.save()
        Transaction.save()
        holdings.save()

        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class LoadUser(APIView):

    def post(self, request, format=None):
        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class LoadPortfolio(APIView):

    def post(self, request, format=None):
        period = request.data["period"]
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        path, periods, charts = load_user_portfolio(profile, period)

        return Response({"Success": {'path': path, 'periods': periods, "charts": charts}}, status=status.HTTP_200_OK)


class FriendPortfolio(APIView):

    def post(self, request, format=None):
        period = request.data["period"]
        username = request.data['username']
        user = User.objects.filter(username=username)
        user = user[0]
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        path, periods, charts = load_user_portfolio(profile, period)
        holdings = get_holdings(profile)

        for symbol, value in charts.items():
            value['quantity'] = holdings[symbol]

        return Response({"Success": {'path': path, 'periods': periods, "charts": charts}}, status=status.HTTP_200_OK)


class FriendsPortfolio(APIView):

    def post(self, request, format=None):
        friends = get_friends(request.user.id)
        portfolios = {}

        for friend in friends:
            user = User.objects.filter(username=friend)
            user = user[0]
            profile = Profile.objects.filter(user_id=user.id)
            profile = profile[0]
            path, last_price = load_friend_portfolio(profile)
            portfolios[friend] = {
                'path': path,
                'last_price': last_price
            }

        return Response({"Success": portfolios}, status=status.HTTP_200_OK)


class SearchUsers(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        query = {}
        users = User.objects.all().values('username')

        for i in users:
            if username in i['username'].lower() and not i['username'] == request.user.username:
                if request.data['friends']:
                    profile = Profile.objects.filter(user_id=request.user.id)
                    profile = profile[0]
                    friends = get_friends(request.user.id)
                    if i['username'] in friends:
                        query[i['username']] = load_user(
                            username=i['username'])
                else:
                    query[i['username']] = load_user(username=i['username'])

        return Response({"Success": query}, status=status.HTTP_200_OK)


class SendInvite(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        unsend = request.data['unsend']
        sender = Profile.objects.filter(user_id=request.user.id)
        sender = sender[0]
        query = User.objects.filter(username=username)
        user = query[0]
        current_time = round(time.time(), 5)
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        invite = Invites.objects.filter(room_code='', receiver_id=profile.id, sender_id=sender.id)

        if unsend:
            invite = invite[0]
            invite.delete()
        else:
            if invite.exists():
                return Response({"Success": "Invite Already Sent"}, status=status.HTTP_200_OK)
            else:
                invite = Invites(room_code='', receiver=profile, sender=sender.id, time=current_time)

        invite.save()

        return Response({"Success": load_user(request)}, status=status.HTTP_200_OK)


class AcceptInvite(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        accepted = request.data['accepted']
        unadd = request.data['unadd']
        sender = Profile.objects.filter(user_id=request.user.id)
        sender = sender[0]
        query = User.objects.filter(username=username)
        user = query[0]
        current_time = round(time.time(), 5)
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        invite = Invites.objects.filter(room_code='', receiver_id=profile.id, sender_id=sender.id)
        invite = invite[0]

        if not unadd:
            if accepted:
                friend = Friends(time=current_time, user=sender, friend=profile)
                friend.save()
        
        invite.delete()

        return Response({"Success": load_user(request)}, status=status.HTTP_200_OK)


class SaveHistory(APIView):

    def post(self, request, format=None):
        path = request.data['path']
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        profile.latest_path = path
        profile.save()
        return Response({"Success": "Path Saved"}, status=status.HTTP_200_OK)


class Leaderboard(APIView):

    def post(self, request, format=None):
        profiles = Profile.objects.values(
            'user_id', 'id', 'cash')
        user_profile = Profile.objects.filter(user_id=request.user.id)
        user_profile = user_profile[0]
        overall = []
        friends = []
        friends_usernames = get_friends(request.user.id)

        for profile in profiles:
            user = User.objects.filter(id=profile['user_id'])
            user = user[0]
            worth = {
                'username': user.username,
                'worth': user_current_worth(profile)
            }

            if user.username in friends_usernames or user.username == request.user.username:
                friends.append(worth)

            overall.append(worth)

        overall.sort(key=lambda x: x['worth'], reverse=True)
        friends.sort(key=lambda x: x['worth'], reverse=True)

        return Response({"overall": overall, 'friends': friends}, status=status.HTTP_200_OK)
