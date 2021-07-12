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
            'username': request.user.username,
            'color': 'black'
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
                    'username': request.user.username,
                    'color': 'black'
                }
            },
            'invites': {},
            'duration': duration,
            'active': False
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
        current_time = time.time()
        if game.end_time != '':
            if int(game.end_time) <= current_time:
                game.room_code = None
                game.invites = {}
                game.active = False
                for player, value in game.players.items():
                    x, worth = load_portfolio(value, game)
                    temp = {
                        'username': value['username'],
                        'first_name': value['first_name'],
                        'last_name': value['last_name'],
                        'color': value['color']
                    }
                    temp['worth'] = worth
                    game.players[player] = temp
                game.save()
                return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)
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
            if request.data['accepted'] and not player_in_game(request.user.username):
                game.players[username] = {
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'username': request.user.username,
                    'color': get_color(game)
                }
                game.save()
                info = get_game_info(game)
            else:
                return Response({"Error", "Player already in Game"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return Response({'game': info, 'user': load_user(username=request.user.username)}, status=status.HTTP_200_OK)


class StartGame(APIView):
    def post(self, request, format=None):
        game = Tournament.objects.filter(host_id=request.user.id)
        game = game[0]
        start_time = math.floor(time.time())
        end_time = start_time
        if game.duration['days'] != None:
            end_time += (game.duration['days'] * 86400)
        if game.duration['hours'] != None:
            end_time += (game.duration['hours'] * 3600)
        if game.duration['mins'] != None:
            end_time += (game.duration['mins'] * 60)
        game.start_time = start_time
        game.end_time = end_time
        current_day = time.localtime()
        current_day = (current_day[0], current_day[1], current_day[2], 1,
                       00, 00, current_day[6], current_day[7], current_day[8])
        current_day = math.floor(time.mktime(current_day)) - 86400
        for player, value in game.players.items():
            value['transactions'] = [
                {'time': time.time() - 86400, 'securities': [], "cash": game.start_amount}]
            value['holdings'] = {}
            value['amount'] = game.start_amount
        game.save()
        info = get_game_info(game)
        return Response({'game': info}, status=status.HTTP_200_OK)


class Buy(APIView):

    def post(self, request, format=None):
        game = get_game(request.data['room_code'])
        player = game.players[request.user.username]
        symbol, quantity, quote, add = transaction(
            request, True, player)
        if (quote['c'] * quantity) > player['amount']:
            return Response({"Error": "Not Enough Funds"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        if request.data['dollars']:
            player['amount'] = player['amount'] - \
                request.data['quantity']
        else:
            player['amount'] = player['amount'] - \
                (quote['c'] * quantity)
        holdings = player['holdings']
        if symbol in holdings:
            holdings[symbol] = holdings[symbol] + quantity
        else:
            holdings[symbol] = quantity
        player['holdings'] = holdings
        add['total_quantity'] = holdings[symbol]
        player['transactions'].append(add)
        game.save()
        info = get_game_info(game)
        return Response({"game": info}, status=status.HTTP_200_OK)


class Sell(APIView):

    def post(self, request, format=None):
        game = get_game(request.data['room_code'])
        player = game.players[request.user.username]
        symbol, quantity, quote, add = transaction(
            request, False, player)

        if quantity > player['holdings'][symbol]:
            return Response({"Error": "Not Enough Shares"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if request.data['dollars']:
            player['amount'] = player['amount'] + \
                request.data['quantity']
        else:
            player['amount'] = player['amount'] + \
                (quote['c'] * quantity)

        player['holdings'][symbol] = player['holdings'][symbol] - quantity
        add['total_quantity'] = player['holdings'][symbol]
        if player['holdings'][symbol] - quantity == 0:
            del player['holdings'][symbol]
        player['transactions'].append(add)
        game.save()
        info = get_game_info(game)
        return Response({"game": game}, status=status.HTTP_200_OK)


class SetColor(APIView):
    def post(self, request, format=None):
        color = request.data['color']
        game = get_game(request.data['room_code'])
        if color_taken(game, color):
            return Response({"Error": "Color Taken"}, status=status.HTTP_400_BAD_REQUEST)
        game.players[request.user.username]['color'] = color
        game.save()
        info = get_game_info(game)
        return Response({"game": info}, status=status.HTTP_200_OK)


class GameHistory(APIView):
    def post(self, request, format=None):
        user_id = request.user.id
        games = Tournament.objects.filter(host_id=user_id).filter(active=False)
        if not games.exists():
            games = Tournament.objects.filter(
                players__has_key=request.user.username).filter(active=False)
            if not games.exists():
                return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)
        history = get_history(games)
        return Response({"games": history}, status=status.HTTP_200_OK)
