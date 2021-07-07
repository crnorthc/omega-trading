from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Profile
from .TopSecret import *
from .serializers import *
from rest_framework.response import Response
from .utils import *
from rest_framework.permissions import AllowAny
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
            else:
                user = User.objects.create_user(
                    username=username, email=email, password=password)
                user.first_name = first_name
                user.last_name = last_name
                profile = Profile(
                    verification_code=verification_code, user=user)
                current_day = time.localtime()
                current_day = (current_day[0], current_day[1], current_day[2], 1,
                               00, 00, current_day[6], current_day[7], current_day[8])
                current_day = math.floor(time.mktime(current_day)) - 86400
                profile.transactions[str(current_day)] = [
                    {'time': time.time() - 86400, 'securities': [], "portfolio_amount": 25000}]
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
        serializer.is_valid()
        if serializer.is_valid():
            verification_code = serializer.data.get('verification_code')
            return verify_user(verification_code)
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


class Buy(APIView):

    def post(self, request, format=None):
        symbol, quantity, quote, profile, add, start_time = transaction(
            request, True)
        if (quote['c'] * quantity) > profile.portfolio_amount:
            return Response({"Error": "Not Enough Funds"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        profile.portfolio_amount = profile.portfolio_amount - \
            (quote['c'] * quantity)
        holdings = profile.holdings
        if symbol in holdings:
            holdings[symbol] = holdings[symbol] + quantity
        else:
            holdings[symbol] = quantity
        profile.holdings = holdings
        add['total_quantity'] = holdings[symbol]
        if str(start_time) in profile.transactions:
            profile.transactions[str(start_time)].append(add)
        else:
            profile.transactions[str(start_time)] = [add]
        profile.save()
        response = load_user(request=request)
        return Response({"Success": response}, status=status.HTTP_200_OK)


class Sell(APIView):

    def post(self, request, format=None):
        symbol, quantity, quote, profile, add, start_time = transaction(
            request, False)
        if quantity > profile.holdings[symbol]:
            return Response({"Error": "Not Enough Shares"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        profile.portfolio_amount = profile.portfolio_amount + \
            (quote['c'] * quantity)

        profile.holdings[symbol] = profile.holdings[symbol] - quantity
        add['total_quantity'] = profile.holdings[symbol]
        if profile.holdings[symbol] - quantity == 0:
            del profile.holdings[symbol]
        if str(start_time) in profile.transactions:
            profile.transactions[str(start_time)].append(add)
        else:
            profile.transactions[str(start_time)] = [add]
        profile.save()
        response = load_user(request=request)
        return Response({"Success": response}, status=status.HTTP_200_OK)


class LoadUser(APIView):

    def post(self, request, format=None):
        response = load_user(request=request)
        return Response({"Success": response}, status=status.HTTP_200_OK)


class LoadUserPortfolio(APIView):

    def post(self, request, format=None):
        period = request.data["period"]
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        if request.data['friends']:
            friend_charts = {}
            for friend, value in profile.friends.items():
                user = User.objects.filter(username=friend)
                user = user[0]
                portfolio, small = load_portfolio(period, user)
                friend_charts[friend] = portfolio
            return Response({"Success": friend_charts}, status=status.HTTP_200_OK)
        else:
            if request.data['username'] != False:
                user = User.objects.filter(username=request.data['username'])
                user = user[0]
                numbers, small_charts = load_portfolio(period, user)
                profile = Profile.objects.filter(user_id=user.id)
                profile = profile[0]
                return Response({"Success": {"numbers": numbers, "small_charts": small_charts, 'holdings': profile.holdings}}, status=status.HTTP_200_OK)
            else:
                numbers, small_charts = load_portfolio(period, request.user)
                return Response({"Success": {"numbers": numbers, "small_charts": small_charts}}, status=status.HTTP_200_OK)


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
                    if i['username'] in profile.friends:
                        query[i['username']] = load_user(
                            username=i['username'])
                else:
                    query[i['username']] = load_user(username=i['username'])
        return Response({"Success": query}, status=status.HTTP_200_OK)


class SendInvite(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        unsend = request.data['unsend']
        sending_profile = Profile.objects.filter(user_id=request.user.id)
        sending_profile = sending_profile[0]
        query = User.objects.filter(username=username)
        user = query[0]
        current_time = time.time()
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        if unsend:
            del sending_profile.invites[username]
            del profile.invites[request.user.username]
        else:
            if request.user.username in profile.invites or username in sending_profile.invites:
                return Response({"Success": "Invite Already Sent"}, status=status.HTTP_200_OK)
            sending_profile.invites[username] = {
                'time': current_time, 'first_name': user.first_name, 'last_name':  user.last_name, 'sent': True}
            profile.invites[request.user.username] = {
                'time': current_time, 'first_name': request.user.first_name, 'last_name':  request.user.last_name, 'sent': False}
        sending_profile.save()
        profile.save()
        response = load_user(request)
        return Response({"Success": response}, status=status.HTTP_200_OK)


class AcceptInvite(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        accepted = request.data['accepted']
        unadd = request.data['unadd']
        sending_profile = Profile.objects.filter(user_id=request.user.id)
        sending_profile = sending_profile[0]
        query = User.objects.filter(username=username)
        user = query[0]
        current_time = time.time()
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]

        if unadd:
            del profile.friends[request.user.username]
            del sending_profile.friends[username]
        else:
            del profile.invites[request.user.username]
            del sending_profile.invites[username]

            if accepted:
                current_time = time.time()
                profile.friends[request.user.username] = {
                    'time': current_time, 'first_name': request.user.first_name, 'last_name': request.user.last_name}
                sending_profile.friends[username] = {
                    'time': current_time, 'first_name': user.first_name, 'last_name': user.last_name}
        profile.save()
        sending_profile.save()
        response = load_user(request)
        return Response({"Success": response}, status=status.HTTP_200_OK)


class SaveHistory(APIView):
    def post(self, request, format=None):
        path = request.data['path']
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        profile.latest_path = path
        profile.save()
        return Response({"Success": "Path Saved"}, status=status.HTTP_200_OK)
