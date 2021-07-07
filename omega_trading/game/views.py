from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Tournament
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.apps import apps
from .utils import *
import time
import math
import requests
import string
import json

Profile = apps.get_model('users', 'Profile')


class StartGame(APIView):
    def post(self, request, format=None):
        user = request.user
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        amount = request.data['amount']
        bet = request.data['bet']
        room_code = get_room_code()
        tournament = Tournament(
            host=user, start_amount=amount, bet=bet, room_code=room_code)
        tournament.players[request.user.username] = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'username': request.user.username
        }
        if profile.portfolio_amount - bet < 0:
            return Response({'Error': "You do not have enough funds to cover the bet"}, status=status.HTTP_200_OK)
        profile.portfolio_amount = profile.portfolio_amount - bet
        game = {
            'host': {
                'username': request.user.username,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name
            },
            'start_amount': amount,
            'bet': bet,
            'room_code': room_code,
            'positions': 0,
            'players': {
                request.user.username: {
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'username': request.user.username
                }
            },
            'invites': {}
        }
        if 'positions' in request.data:
            tournament.positions = request.data['positions']
            game['positions'] = request.data['positions']
        tournament.save()
        return Response({'game': game}, status=status.HTTP_200_OK)


class LoadGame(APIView):
    def post(self, request, format=None):
        user_id = request.user.id
        game = Tournament.objects.filter(host_id=user_id).filter(active=True)
        if not game.exists():
            game = Tournament.objects.filter(
                players__has_key=request.user.username).filter(active=True)
            if not game.exists():
                return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)
        game = game[0]
        info = get_game_info(game)
        return Response({'game': info}, status=status.HTTP_200_OK)


class SendInvite(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        room_code = request.data['room_code']
        user = User.objects.filter(username=username)
        user = user[0]
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        game = get_game(room_code)
        if request.data['unadd']:
            game = uninvite(game, profile, username, room_code)
            game.save()
            info = get_game_info(game)
            return Response({'game': info}, status=status.HTTP_200_OK)
        else:
            if username in game.invites:
                return Response({'Error': get_game_info(game)}, status=status.HTTP_200_OK)
            game.invites[username] = {
                'sender': request.user.username,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
            game.save()
            info = get_game_info(game)
            profile.invites[room_code] = {
                'sender': request.user.username,
                'game': info,
                'sent': False
            }
            profile.save()
            return Response({'game': info}, status=status.HTTP_200_OK)


class JoinGame(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        room_code = request.data['room_code']
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        game = get_game(room_code)
        if request.data['unadd']:
            del game.players[username]
            game.save()
            info = get_game_info(game)
        else:
            game = uninvite(profile, request.user.username, room_code)
            game.save()
            info = get_game_info(game)
            if request.data['accepted']:
                game.players[username] = {
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'username': request.user.username
                }
                game.save()
                info = get_game_info(game)
        return Response({'game': info, 'user': load_user(username=request.user.username)}, status=status.HTTP_200_OK)
