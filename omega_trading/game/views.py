from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Tournament
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.apps import apps
from .utils import *
from .bets import *
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

        game = Tournament(
            host=user, start_amount=amount, bet=bet, room_code=room_code, duration=duration)

        game.players[request.user.username] = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'username': request.user.username,
            'color': 'black'
        }

        if 'positions' in request.data:
            game.positions = request.data['positions']

        game.save()

        return Response({'game': get_game_info(game)}, status=status.HTTP_200_OK)


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
                return game_over(game)

        return Response({'game': get_game_info(game)}, status=status.HTTP_200_OK)


class EditGame(APIView):

    def post(self, request, format=None):
        amount = request.data['amount']
        bet = request.data['bet']
        duration = {
            'days': request.data['days'],
            'hours': request.data['hours'],
            'mins': request.data['mins']
        }

        game = get_game(request.data['code'])
        game.start_amount = amount
        game.bet = bet
        game.duration = duration

        if 'positions' in request.data:
            game.positions = request.data['positions']

        game.save()

        return Response({'game': get_game_info(game)}, status=status.HTTP_200_OK)


class SendInvite(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        room_code = request.data['room_code']

        if request.data['unadd']:
            return Response({'game': uninvite(username, room_code)},
                            status=status.HTTP_200_OK)

        user = User.objects.filter(username=username)
        user = user[0]
        profile = Profile.objects.filter(user_id=user.id)
        profile = profile[0]
        game = get_game(room_code)

        if username in game.invites:
            return Response({'Error': get_game_info(game)}, status=status.HTTP_200_OK)

        game.invites[username] = {
            'sender': request.user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        game.save()

        profile.invites[room_code] = {
            'sender': request.user.username,
            'game': get_game_info(game),
            'sent': False
        }
        profile.save()

        return Response({'game': get_game_info(game)}, status=status.HTTP_200_OK)


class JoinGame(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        room_code = request.data['room_code']

        if request.data['unadd']:
            return remove_player(request)
        else:
            uninvite(request.user.username, room_code)

        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        game = get_game(room_code)

        if 'address' in game.contract:
            game.contract['players'][username] = False

        if request.data['accepted'] and not player_in_game(request.user.username):
            game.players[username] = {
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'username': request.user.username,
                'color': get_color(game)
            }
            game.save()
        else:
            return Response({"Error", "Player already in Game"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        return Response({'game': get_game_info(game), 'user': load_user(username=request.user.username)}, status=status.HTTP_200_OK)


class StartGame(APIView):
    def post(self, request, format=None):
        game = Tournament.objects.filter(host_id=request.user.id, active=True)
        game = game[0]
        start_time = math.floor(time.time())
        end_time = start_time

        if game.duration['days'] != None:
            end_time += (game.duration['days'] * SECONDS_IN_DAY)
        if game.duration['hours'] != None:
            end_time += (game.duration['hours'] * SECONDS_IN_HOUR)
        if game.duration['mins'] != None:
            end_time += (game.duration['mins'] * SECONDS_IN_MINUTE)

        game.start_time = start_time
        game.end_time = end_time

        current_day = time.localtime()
        current_day = (current_day[0], current_day[1], current_day[2], 1,
                       00, 00, current_day[6], current_day[7], current_day[8])
        current_day = math.floor(time.mktime(current_day)) - SECONDS_IN_DAY

        for player, value in game.players.items():
            value['transactions'] = [
                {'time': time.time() - SECONDS_IN_DAY, 'securities': [], "cash": game.start_amount}]
            value['holdings'] = {}
            value['amount'] = game.start_amount

        game.save()

        return Response({'game': get_game_info(game)}, status=status.HTTP_200_OK)


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

        return Response({"game": get_game_info(game)}, status=status.HTTP_200_OK)


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

        return Response({"game": get_game_info(game)}, status=status.HTTP_200_OK)


class SetColor(APIView):

    def post(self, request, format=None):
        color = request.data['color']
        game = get_game(request.data['room_code'])

        if color_taken(game, color):
            return Response({"Error": "Color Taken"}, status=status.HTTP_400_BAD_REQUEST)

        game.players[request.user.username]['color'] = color
        game.save()

        return Response({"game": get_game_info(game)}, status=status.HTTP_200_OK)


class GameHistory(APIView):
    def post(self, request, format=None):
        user_id = request.user.id
        games = Tournament.objects.filter(host_id=user_id).filter(active=False)

        if not games.exists():
            games = Tournament.objects.filter(
                players__has_key=request.user.username).filter(active=False)
            if not games.exists():
                return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"games": get_history(games)}, status=status.HTTP_200_OK)


class MakeBet(APIView):

    def post(self, request, format=None):
        address = get_address(request)
        game = get_game(request.data['room_code'])

        if not address:
            return Response({'Error': 'Invalid Address'}, status=status.HTTP_403_FORBIDDEN)
        else:
            game.players[request.user.username]['address'] = address

        key = request.data['key']
        contract_address = game.contract['address']
        abi = game.contract['abi']
        value = game.contract['bet']

        submit_bet(contract_address, abi, address, key, value)

        game.contract['players'][request.user.username] = True

        game.save()

        return Response({"game": get_game_info(game)}, status=status.HTTP_200_OK)


class CreateContract(APIView):

    def post(self, request, format=None):
        key = request.data['key']
        value = request.data['value']
        address = get_address(request)
        game = Tournament.objects.filter(host_id=request.user.id, active=True)
        game = game[0]

        if not address:
            return Response({'Error': 'Invalid Address'}, status=status.HTTP_403_FORBIDDEN)
        else:
            game.players[request.user.username]['address'] = address

        abi, contract_address = create_contract(address, key, value)
        players = {}

        for username, data in game.players.items():
            if username == request.user.username:
                players[username] = True
            else:
                players[username] = False

        game.contract = {
            'address': contract_address,
            'abi': abi,
            'bet': request.data['bet'],
            'players': players
        }
        game.save()

        return Response({"game": get_game_info(game)}, status=status.HTTP_200_OK)


class EtherQuote(APIView):

    def post(self, request, format=None):
        r = requests.get(
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=' + CRYPTO_KEY + '&symbol=ETH')

        r = r.json()
        time = r['status']['timestamp'][11:16]

        if int(time[0:2]) - 4 > 12:
            time = ' ' + str(int(time[0:2]) - 16) + time[2:] + " PM"
        else:
            if int(time[0:2]) >= 0 and int(time[0:2]) <= 4:
                time = ' ' + str(8 + int(time[0:2])) + time[2:] + ' PM'
            else:
                time = ' ' + str((int(time[0:2]) - 4)) + time[2:] + ' AM'

        return Response({"etherQuote": {'quote': r['data']['ETH']['quote']['USD']['price'], 'time': time}}, status=status.HTTP_200_OK)


class GasQuote(APIView):

    def post(self, request, format=None):
        return Response({"gasQuote": gas_quote()}, status=status.HTTP_200_OK)
