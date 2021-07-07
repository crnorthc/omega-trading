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


class CreateGame(APIView):
    def post(self, request, format=None):
        user = request.user
        amount = request.data['amount']
        bet = request.data['bet']
        room_code = get_room_code()
        duration = {
            'days': request.data['days'],
            'hours': request.data['hours'],
            'mins': request.data['mins']
        }
        if 'code' in request.data:
            game = get_game(request.data['code'])
            game.start_amount = amount
            game.bet = bet
            game.duration = duration
            if 'positions' in request.data:
                game.positions = request.data['positions']
            game.save()
            info = get_game_info(game)
            return Response({'game': info}, status=status.HTTP_200_OK)
        tournament = Tournament(
            host=user, start_amount=amount, bet=bet, room_code=room_code, duration=duration)
        tournament.players[request.user.username] = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'username': request.user.username
        }
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
            'invites': {},
            'duration': duration
        }
        if 'positions' in request.data:
            tournament.positions = request.data['positions']
            game['positions'] = request.data['positions']
        tournament.save()
        return Response({'game': game}, status=status.HTTP_200_OK)


class LoadGame(APIView):
    def post(self, request, format=None):
        print(request.user)
        user_id = request.user.id
        game = Tournament.objects.filter(host_id=user_id).filter(active=True)
        print(game.exists())
        if not game.exists():
            game = Tournament.objects.filter(
                players__has_key=request.user.username).filter(active=True)
            if not game.exists():
                return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)
            else:
                print(get_game_info(game[0]))
        else:
            print(get_game_info(game[0]))
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
            game, profile = uninvite(game, profile, username, room_code)
            game.save()
            profile.save()
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
            game, profile = uninvite(profile, request.user.username, room_code)
            profile.save()
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
