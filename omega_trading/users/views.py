from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q
from .serializers import *
from .TopSecret import *
from .wallets import *
from .models import *
from .utils import *
import time

Player = apps.get_model('game', 'Player')

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
            user = users[0]
            token = Token.objects.filter(user_id=user.id)
            id = IDToken.objects.filter(user=user)
            if token.exists():
                return Response({'Error': 'Email Taken'}, status=status.HTTP_403_FORBIDDEN)
            else:
                if id.exists():
                    return Response({'Error': 'Verify Account'}, status=status.HTTP_401_UNAUTHORIZED)


        if users.exists():
            return Response({'Error': 'Username Taken'}, status=status.HTTP_403_FORBIDDEN)

        key = generate_token()

        user = User.objects.create_user(
            username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        token = IDToken(key=key, user=user)

        user.save()
        token.save()

        send_email_verification(email, username, key)

        return Response({"Success": "Verification Email Sent"}, headers=set_cookie(key, 'uid'), status=status.HTTP_200_OK)


class VerifyEmail(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        key = request.data['key']

        keys = IDToken.objects.filter(key=key)

        if keys.exists():
            key = keys[0]
            return verify_user(key.user_id)
        else:
            return Response({'Error': 'Invalid Verification Code'}, status=status.HTTP_403_FORBIDDEN)


class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        user = User.objects.filter(username=username)

        if not user.exists():
            return Response({'Error': 'Invalid Username'}, status=status.HTTP_403_FORBIDDEN)

        user = user[0]

        if user.check_password(password):
            token = Token.objects.filter(user_id=user.id)

            if not token.exists():
                return Response({'Error': 'Verify Account'}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return login(user)
                
        else:
            return Response({'Error': 'Invalid Password'}, status=status.HTTP_403_FORBIDDEN)


class Logout(APIView):

    def post(self, request, format=None):

        return logout(request.user)


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
    permission_classes = []

    def post(self, request, format=None):
        if request.auth == None:
            return Response({"Error": 'No User'}, status=status.HTTP_204_NO_CONTENT)

        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class SearchUsers(APIView):
    
    def post(self, request, format=None):
        username = request.data['username']
        query = {}

        if request.data['friends']:
            users = get_friends(request.user.id, username)
        else:
            users = get_users(username)

        for i in users:
            if i['username'] != request.user.username:
                query[i['username']] = {
                    'first_name': i['first_name'],
                    'last_name': i['last_name']
                }

        return Response({"Success": query}, status=status.HTTP_200_OK)


class JoinGame(APIView):

    def post(self, request, format=None):
        game = get_game(request.data['room_code'])
        player = Player(user=request.user, game=game)
        player.save()

        invite = Invites.objects.filter(receiver_id=request.user.id, game_id=game.id)

        if invite.exists():
            invite = invite[0]
            invite.delete()


        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


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
                invite = Invites(receiver=receiever, sender=sender, time=current_time)

        invite.save()

        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class AcceptInvite(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        accepted = request.data['accepted']
        receiever = request.user
        sender = User.objects.filter(username=username)
        sender = sender[0]
        current_time = round(time.time(), 5)
        invite = Invites.objects.filter(game_id=None, receiver_id=receiever.id, sender_id=sender.id)
        invite = invite[0]

        if accepted:
            friend = Friends(time=current_time, user=sender, friend=receiever)
            friend.save()
        
        invite.delete()

        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class RemoveFriend(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        friend = User.objects.filter(username=username)
        friend = friend[0]

        friend = Friends.objects.filter(Q(friend_id=friend.id, user_id=request.user.id) | Q(friend_id=request.user.id, user_id=friend.id))
        friend = friend[0]

        friend.delete()

        return Response({"Success": load_user(request=request)}, status=status.HTTP_200_OK)


class Wallets(APIView):

    def post(self, request, format=None):

        return Response({"wallets": get_wallets(request.user)}, status=status.HTTP_200_OK)










