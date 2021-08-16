from django.shortcuts import redirect
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.apps import apps
from .utils import *
from .bets import *
import time
import math
import requests
import datetime
import json


class CreateGame(APIView):

    def post(self, request, format=None):
        amount = int(request.data['amount'][1:].replace(',',''))
        bet = request.data['bet']
        public = request.data['Public']
        name = request.data['name']
        date = request.data['date']
        commission = request.data['commission']
        options = request.data['options']
        endOn = request.data['endOn']
        room_code = get_room_code()

        if bet == 'no':
            bet = False
        else:
            bet = True

        if commission != None:
            commission = float(commission[1:])

        if endOn == 'date':
            time = date_to_UNIX(date)

            game = Game(
            start_amount=amount, e_bet=bet, commission=commission, room_code=room_code, end_time=time, name=name, public=public, options=options)
        else:
            days = int(date['days'])
            hours = int(date['hours'])
            mins = int(date['mins'])

            duration = Duration(days=days, hours=hours, minutes=mins)

            duration.save()
    
            game = Game(
                start_amount=amount, e_bet=bet, commission=commission, room_code=room_code, duration=duration, name=name, public=public, options=options)

        host = Player(user=request.user, game=game, is_host=True, cash=amount)

        game.save()
        host.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class LoadGame(APIView):

    def post(self, request, format=None):
        code = request.data['room_code']
        game = Game.objects.filter(room_code=code)        

        if not game.exists():
            return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)

        game = game[0]

        current_time = time.time()

        if game.end_time != 0:
            if game.end_time <= current_time:
                return game_over(game)

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class EditGame(APIView):

    def post(self, request, format=None):
        date = request.data['date']
        commission = request.data['commission']
        code = request.data['code']
        endOn = request.data['endOn']

        game = Game.objects.filter(room_code=code)
        game = game[0]
        duration = Duration.objects.filter(id=game.duration_id)

        if endOn == 'date':
            game.end_time = date_to_UNIX(date)
            
            if duration.exists():
                duration = duration[0]
                duration.delete()                
                game.duration_id = None
        else:
            days = int(date['days'])
            hours = int(date['hours'])
            mins = int(date['mins'])

            if duration.exists():
                duration = duration[0]
                duration.days = days
                duration.hours = hours
                duration.minutes = mins
            else:
                game.end_time = ''
                duration = Duration(days=days, hours=hours, minutes=mins)

            duration.save()
    
        game.options = request.data['options']
        game.start_amount = int(request.data['amount'][1:].replace(',',''))

        if commission != None:
            game.commission = float(commission[1:])
        else:
            game.commission = None

        game.duration_id = duration.id

        game.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class ChangeType(APIView):

    def post(self, request, format=None):
        code = request.data['code']
        game = Game.objects.filter(room_code=code)
        game = game[0]

        game.public = request.data['type']
        game.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class SendInvite(APIView):

    def post(self, request, format=None):
        username = request.data['username']
        room_code = request.data['room_code']

        if request.data['unadd']:
            return Response({'game': uninvite(username, room_code)},
                            status=status.HTTP_200_OK)

        receiever_user = User.objects.filter(username=username)
        receiever_user = receiever_user[0]
        game = get_game(room_code)
        invites = get_invites(game)

        if username in invites:
            return Response({'Error': get_game_info(game, request.user)}, status=status.HTTP_200_OK)

        current_time = round(time.time(), 5)

        invite = Invites(time=current_time, game_id=game.id, sender=request.user, receiver=receiever_user)

        invite.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)

# Remove username from action params
class JoinGame(APIView):

    def post(self, request, format=None):
        room_code = request.data['room_code']

        if request.data['unadd']:
            return remove_player(request)
        else:
            uninvite(request.user.username, room_code)

        game = get_game(room_code)

        if request.data['accepted'] and not player_in_game(request.user.username):
            player = Player(user=request.user, tournament=game)
            player.save()
        else:
            return Response({"Error", "Player already in Game"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        return Response({'game': get_game_info(game, request.user), 'user': load_user(username=request.user.username)}, status=status.HTTP_200_OK)


class StartGame(APIView):
    def post(self, request, format=None):
        game = get_game(request.user)
        start_time = math.floor(time.time())
        end_time = start_time
        duration = get_duration(game)

        if duration['days'] != None:
            end_time += (duration['days'] * SECONDS_IN_DAY)
        if duration['hours'] != None:
            end_time += (duration['hours'] * SECONDS_IN_HOUR)
        if duration['mins'] != None:
            end_time += (duration['mins'] * SECONDS_IN_MINUTE)

        game.start_time = start_time
        game.end_time = end_time
        game.active = True

        current_day = time.localtime()
        current_day = (current_day[0], current_day[1], current_day[2], 1,
                       00, 00, current_day[6], current_day[7], current_day[8])
        current_day = math.floor(time.mktime(current_day)) - SECONDS_IN_DAY

        initial_transactions(game)

        game.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class Buy(APIView):

    def post(self, request, format=None):
        game = get_game(request.data['room_code'])
        player = get_player(request.user)

        symbol, quantity, quote, trans = transaction(
            request, True, player)

        if (quote['c'] * quantity) > player.cash:
            return Response({"Error": "Not Enough Funds"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if request.data['dollars']:
            player.cash = round(player.cash - request.data['quantity'], 4)
        else:
            player.cash = round(player.cash - (quote['c'] * quantity), 4)

        holdings = Holdings.objects.filter(player_id=player.id, symbol=symbol)

        if holdings.exists():
            holdings = holdings[0]
            holdings.quantity = holdings.quantity + quantity
        else:
            holdings = Holdings(symbol=symbol, quantity=quantity, player=player)

        trans.total_quantity = holdings.quantity

        trans.save()
        player.save()

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class Sell(APIView):

    def post(self, request, format=None):
        game = get_game(request.data['room_code'])
        player = get_player(request.user)

        symbol, quantity, quote, trans = transaction(
            request, False, player)

        holdings = Holdings.objects.filter(player_id=player.id, symbol=symbol)

        if quantity > holdings.quantity:
            return Response({"Error": "Not Enough Shares"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if request.data['dollars']:
            player.cash = round(player.cash + request.data['quantity'], 4)
        else:
            player.cash = round(player.cash + (quote['c'] * quantity), 4)

        holdings.quantity = holdings.quantity - quantity

        trans.total_quantity = holdings.quantity

        if holdings.quantity == 0:
            holdings.delete()

        trans.save()
        player.save()

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class GameHistory(APIView):
    def post(self, request, format=None):
        games = PlayerHistory.objects.filter(user=request.user)

        if not games.exists():
            return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"games": get_history(games)}, status=status.HTTP_200_OK)


class MakeBet(APIView):

    def post(self, request, format=None):
        game = get_game(request.data['room_code'])
        address = get_address(request, game)

        if not address:
            return Response({'Error': 'Invalid Address'}, status=status.HTTP_403_FORBIDDEN)

        key = request.data['key']
        bet_amount = game.contract['bet']
        fee = game.contract['fee']

        if not check_balance(address, bet_amount, fee):
            return Response({'Error': 'Not Enough Funds'}, status=status.HTTP_403_FORBIDDEN)
        else:
            player = get_player(request.user)
            player.address = address
            player.key = key
            player.payed = True

        if all_bets_made(game):
            contract = get_contract(game)
            contract.bets_complete = True
            contract.save()

        player.save()

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


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
        fee, abi, bytecode = contract_fee_estimate()
        return Response({"gasQuote": fee}, status=status.HTTP_200_OK)


class SubmitContract(APIView):

    def post(self, request, format=None):
        game = get_game(request.user)
        contract = get_contract(game)
        bet_amount = contract.bet
        fee = contract.fee
        players_info = contract_players(game)

        for username, player in players_info.items():
            address = player['address']

            if not check_balance(address, bet_amount, fee):
                return Response({'Error': player + ' does not have enough funds'}, status=status.HTTP_403_FORBIDDEN)

            user = User.objects.filter(username=username)
            user = user[0]
            player = get_player(user)

            player.address = address,
            player.key = player['key']
            player.payed = False
            
            player.save()

        place_bets(contract.contract, contract_players(game), bet_amount, fee)

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class DefineContract(APIView):

    def post(self, request, format=None):
        bet_amount = request.data['bet']
        player = Player.objects.filter(user=request.user)
        player = player[0]
        game = Game.objects.filter(id=player.game_id, active=True)
        game = game[0]
        address = get_address(request, game)

        fee, abi, bytecode = contract_fee_estimate()

        if not check_balance(address, bet_amount, fee):
            return Response({'Error': 'Not Enough Funds'}, status=status.HTTP_403_FORBIDDEN)

        contract_data = {
            'bytecode': bytecode,
            'abi': abi
        }

        contract = Contract(contract=contract_data, bet=request.data['bet'], fee=fee)

        player = get_player(request.user)

        player.address = address

        contract.save()
        player.save()

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class StartBets(APIView):

    def post(self, request, format=None):
        player = Player.objects.filter(user=request.user)
        player = player[0]
        game = Game.objects.filter(id=player.game_id, active=True)
        game = game[0]

        contract = get_contract(game)

        contract.ready_to_bet = True

        contract.save()

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class ReadyUp(APIView):

    def post(self, request, format=None):
        room_code = request.data['room_code']

        game = get_game(room_code)

        player = get_player(request.user)
        player.ready = not player.ready
        player.save()

        if ready_to_start(game):
            contract = get_contract(game)
            contract.ready_to_start = True
            contract.save()

        return Response({"game": get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class CurrentGames(APIView):

    def get(self, request, format=None):
        games_query = Player.objects.filter(user_id=request.user.id).values()

        games = []

        for _, player in enumerate(games_query):
            game = Game.objects.filter(id=player['game_id'])
            game = game[0]

            players = Player.objects.filter(game_id=player['game_id']).count()

            info = {
                'room_code': game.room_code,
                'name': game.name,
                'size': players,
                'status': game.start_time != '',
                'host': get_host_username(game),
                'eBet': game.e_bet
            }

            if game.duration == None:
                info['end'] = get_end_time(int(game.end_time))
            else:
                info['duration'] = get_duration(game)

            games.append(info)

        return Response({"games": games}, status=status.HTTP_200_OK)


class GameInfo(APIView):

    def get(self, request, room_code):
        game = Game.objects.filter(room_code=room_code)
        game = game[0]

        game_info = {
            'room_code': game.room_code,
            'start_amount': game.start_amount,
            'bet': game.bet,
            'duration': get_duration(game),
            'positions': game.positions,
            'players': get_players(game)
        }

        return Response({'game': game_info}, status=status.HTTP_200_OK)
            

class SearchGames(APIView):

    def post(self, request, format=None):
        duration = request.data['metrics']['duration']
        game = Game.objects.filter(id=22)
        game = game[0]
        query = formulate_query(request)

        games = Game.objects.raw(query)


        return Response({'search': get_results(games, duration)}, status=status.HTTP_200_OK)


class Populate(APIView):
    
    def post(self, request, format=None):
        games = Game.objects.filter(active=False)[:50]

        results = []

        for game in games:
            players = Player.objects.filter(game_id=game.id).count()

            info = {
                'room_code': game.room_code,
                'name': game.name,
                'size': players,
                'status': game.start_time != 0,
                'host': get_host_username(game),
                'eBet': game.e_bet
            }

            if game.duration == None:
                info['end'] = get_end_time(int(game.end_time))
            else:
                info['duration'] = get_duration(game)

            results.append(info)

        return Response({'search': results}, status=status.HTTP_200_OK)