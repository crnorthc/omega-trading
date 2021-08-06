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
import string
import json

Profile = apps.get_model('users', 'Profile')


class CreateGame(APIView):

    def post(self, request, format=None):
        amount = request.data['amount']
        bet = request.data['bet']
        public = request.data['public']
        name = request.data['name']
        room_code = get_room_code()

        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]

        duration = Duration(days=request.data['days'], hours=request.data['hours'], minutes=request.data['mins'])

        game = Tournament(
            start_amount=amount, bet=bet, room_code=room_code, duration=duration, name=name, public=public)

        if 'positions' in request.data:
            game.positions = request.data['positions']

        host = Player(profile=profile, tournament=game, is_host=True, color='black')

        game.save()
        host.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class LoadGame(APIView):

    def post(self, request, format=None):
        game = get_game(request.user)

        if not game.exists():
            return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)

        current_time = time.time()

        if game.end_time != '':
            if int(game.end_time) <= current_time:
                return game_over(game)

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


class EditGame(APIView):

    def post(self, request, format=None):
        amount = request.data['amount']
        bet = request.data['bet']
        game = get_game(request.user)
        duration = Duration.objects.filter(id=game.duration_id)

        duration['days'] = request.data['days'],
        duration['hours'] = request.data['hours'],
        duration['mins'] = request.data['mins']

        duration.save()

        game.start_amount = amount
        game.bet = bet

        if 'positions' in request.data:
            game.positions = request.data['positions']

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
        receiever_profile = Profile.objects.filter(user_id=receiever_user.id)
        receiever_profile = receiever_profile[0]
        sender_profile = Profile.objects.filter(user_id=request.user.id)
        sender_profile = sender_profile[0]
        game = get_game(room_code)
        invites = get_invites(game)

        if username in invites:
            return Response({'Error': get_game_info(game, request.user)}, status=status.HTTP_200_OK)

        current_time = round(time.time(), 5)

        invite = Invites(time=current_time, game_id=game.id, sender_id=sender_profile.id, receiver_id=receiever_profile.id)

        invite.save()

        return Response({'game': get_game_info(game, request.user)}, status=status.HTTP_200_OK)


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

        if request.data['accepted'] and not player_in_game(request.user.username):
            player = Player(profile=profile, tournament=game, color=get_color(game))
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
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]

        games = PlayerHistory.objects.filter(profile_id=profile.id)

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
        game = Tournament.objects.filter(host_id=request.user.id, active=True)
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
        game = Tournament.objects.filter(host_id=request.user.id, active=True)
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
        profile = Profile.objects.filter(user_id=request.user.id)
        profile = profile[0]
        tournaments = Player.objects.filter(profile_id=profile.id).values()

        games = []

        for _, player in enumerate(tournaments):
            game = Tournament.objects.filter(id=player['tournament_id'])
            game = game[0]

            games.append({
                'room_code': game.room_code,
                'name': game.name
            })

        return Response({"games": games}, status=status.HTTP_200_OK)


class GameInfo(APIView):

    def get(self, request, room_code):
        game = Tournament.objects.filter(room_code=room_code)
        game = game[0]

        game_info = {
            'room_code': game.room_code,
            'start_amount': game.start_amount,
            'bet': game.bet,
            'duration': get_duration(game),
            'positions': game.positions,
            'players': get_players(game)
        }

        if game.is_contract: 
            contract = get_contract_info(game)
            game_info['contract'] = contract.bet

        return Response({'game': game_info}, status=status.HTTP_200_OK)
            

class SearchGames(APIView):

    def post(self, request, format=None):
        amount_floor = request.data['metrics']['amount']['from']
        amount_ceil = request.data['metrics']['amount']['to']
        bet_floor = request.data['metrics']['bet']['from']
        bet_ceil = request.data['metrics']['bet']['to']
        positions_floor = request.data['metrics']['positions']['from']
        positions_ceil = request.data['metrics']['positions']['to']
        days_floor = request.data['metrics']['days']['from']
        days_ceil = request.data['metrics']['days']['to']
        hours_floor = request.data['metrics']['hours']['from']
        hours_ceil = request.data['metrics']['hours']['to']
        mins_floor = request.data['metrics']['mins']['from']
        mins_ceil = request.data['metrics']['mins']['to']
        contract = request.data['metrics']['smart-bet']

        if contract:
            query = 'SELECT * FROM \
                        (\
                            SELECT * FROM \
                                (\
                                SELECT * FROM game_tournament \
                                WHERE is_contract = TRUE AND public=TRUE\
                                ) \
                            FULL JOIN game_contract ON game_tournament.id=game_contract=tournament_id \
                            WHERE game_contract.bet >= {floor} AND game_contract.bet <= {ceil} \
                        ) \
                        FULL JOIN game_duration ON game_tournament.duration_id=game_duration.id \
                        WHERE '.format(floor=bet_floor, ceil=bet_ceil)
        else:
            query = 'SELECT * FROM \
                        game_tournament FULL JOIN game_duration ON game_tournament.duration_id=game_duration.id \
                    WHERE is_contract = FALSE AND public=TRUE AND '

        if bet_ceil != 0:
            query = query + 'bet >= {floor} AND bet <= {ceil} AND '.format(floor=bet_floor, ceil=bet_ceil)

        if amount_ceil != 0:
            query = query + 'start_amount >= {floor} AND start_amount <= {ceil} AND '.format(floor=amount_floor, ceil=amount_ceil)

        if positions_ceil != 0:
            query = query + 'positions >= {floor} AND positions <= {ceil} AND '.format(floor=positions_floor, ceil=positions_ceil)

        if positions_ceil != 0:
            query = query + 'positions >= {floor} AND positions <= {ceil} AND '.format(floor=positions_floor, ceil=positions_ceil)

        query = query[:-5]

        games = Tournament.objects.raw(query)

        games_data = []
        
        for game in games:
            days = game.days
            hours = game.hours
            mins = game.minutes
            duration = False
            game_info = {}
        
            if not days > days_floor and days < days_ceil:
                if days_floor == days_ceil:
                    if not hours > hours_floor and hours < hours_ceil:
                        if hours_ceil == hours_floor:
                            if mins >= mins_floor and mins <= mins_ceil:
                                duration = True
            else:
                duration = True

            if duration:
                game_info ={
                    'room_code': game.room_code,
                    'name': game.name
                }

                games_data.append(game_info)

        return Response({'search': games_data}, status=status.HTTP_200_OK)


class SearchBasic(APIView):
    
    def post(self, request, format=None):
        room_code = request.data['code']
        name = request.data['name']

        if room_code == '':
            games = Tournament.objects.filter(name=name).values()
        else:
            games = Tournament.objects.filter(room_code=room_code).values()

        games_info = []

        for _, game in enumerate(games):
            games_info.append({
                'room_code': game['room_code'],
                'name': game['name']
            })

        return Response({'search': games_info}, status=status.HTTP_200_OK)