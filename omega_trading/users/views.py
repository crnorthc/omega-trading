from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import *
from .TopSecret import *
from .serializers import *
from rest_framework.response import Response
from .utils import *
from rest_framework.permissions import AllowAny
import time


class CreateUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        emails = User.objects.filter(email=email)
        users = User.objects.filter(username=username)

        if emails.exists():
            return Response({'Error': 'Email Taken'}, status=status.HTTP_403_FORBIDDEN)

        if users.exists():
            return Response({'Error': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)

        key = generate_token()

        user = User.objects.create_user(
            username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        token = Token(key=key, user=request.user)

        user.save()
        token.save()

        send_email_verification(email, username, key)

        return Response({"Success": "Verification Email Sent"}, status=status.HTTP_200_OK)


class VerifyEmail(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        key = request.data['key']
        
        key = key.decode('base64', 'strict')

        keys = IDToken.objects.filter(key=key)

        if keys.exists():
            return verify_user(request.user)
        else:
            return Response({'Error': 'Invalid Verification Code'}, status=status.HTTP_403_FORBIDDEN)


class LoginUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(username=username, password=password)
        user_queryset = User.objects.filter(username=username)

        if not user_queryset.exists():
            return Response({'Error': 'Invalid Username'}, status=status.HTTP_400_BAD_REQUEST)

        if user is not None:
            return login(user)
        else:
            return Response({'Error': 'Invalid Password'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutUser(APIView):

    def post(self, request, format=None):

        return logout(request)


class UpdateUsername(APIView):

    def post(self, request, format=None):
        old_username = request.data['old_username']
        new_username = request.data['new_username']
        user = User.objects.filter(username=old_username)

        if user.exists() and new_username != old_username:
            return Response({'Error': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)
        else:
            user = User.objects.filter(username=old_username)
            user = user[0]
            user.username = new_username
            user.save()

            return Response({"Success": "Update Complete"}, status=status.HTTP_200_OK)


class ResetPassword(APIView):
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


class ForgotPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        user = User.objects.filter(email=request.data['email'])

        if not user.exists():
            return Response({"Error": "Invalid Email"}, status=status.HTTP_200_OK)

        return send_password_reset(user[0])


class LoadUser(APIView):

    def get(self, request, format=None):
        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class SearchUsers(APIView):
    
    def post(self, request, format=None):
        username = request.data['username']
        query = {}
        users = User.objects.all().values('username')

        for i in users:
            if username in i['username'].lower() and not i['username'] == request.user.username:
                if request.data['friends']:
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
        sender = request.user
        receiever = User.objects.filter(username=username)
        receiever = receiever[0]
        current_time = round(time.time(), 5)
        invite = Invites.objects.filter(receiver=receiever, sender=sender)

        if unsend:
            invite = invite[0]
            invite.delete()
        else:
            if invite.exists():
                return Response({"Success": "Invite Already Sent"}, status=status.HTTP_200_OK)
            else:
                invite = Invites(receiver=receiever, sender=sender.id, time=current_time)

        invite.save()

        return Response({"Success": load_user(request)}, status=status.HTTP_200_OK)


class AcceptInvite(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        accepted = request.data['accepted']
        unadd = request.data['unadd']
        sender = request.user
        receiever = User.objects.filter(username=username)
        receiever = receiever[0]
        current_time = round(time.time(), 5)
        invite = Invites.objects.filter(room_code='', receiver=receiever, sender=sender)
        invite = invite[0]

        if not unadd:
            if accepted:
                friend = Friends(time=current_time, user=sender, friend=receiever)
                friend.save()
        
        invite.delete()

        return Response({"Success": load_user(request)}, status=status.HTTP_200_OK)


