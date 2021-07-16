from django.contrib.auth.models import User
from django.apps import apps
from .TopSecret import *
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament
import random
import string
import math
import time
import requests

Profile = apps.get_model('users', 'Profile')
SECONDS_IN_DAY = 24 * 60 * 60
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MINUTE = 60


def load_user(request=None, username=None):
    if request == None:
        queryList = User.objects.filter(username=username)
        user = queryList[0]
    else:
        user = request.user

    profile = Profile.objects.filter(user_id=user.id)
    profile = profile[0]

    response = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "portfolio_amount": profile.portfolio_amount,
        "holdings": profile.holdings,
        'invites': profile.invites,
        'friends': profile.friends
    }

    return response


def get_game(room_code):
    game = Tournament.objects.filter(room_code=room_code)

    if game.exists():
        game = game[0]
        return game

    return Response({"Error": "No Room Found"}, status=status.HTTP_404_NOT_FOUND)


def uninvite(username, room_code):
    user = User.objects.filter(username=username)
    user = user[0]
    profile = Profile.objects.filter(user_id=user.id)
    profile = profile[0]
    game = get_game(room_code)

    if username in game.invites:
        del game.invites[username]
    if room_code in profile.invites:
        del profile.invites[room_code]

    game.save()
    profile.save()

    return get_game_info(game)


def remove_player(request):
    username = request.data['username']
    room_code = request.data['room_code']
    game = get_game(room_code)

    del game.players[username]
    game.save()

    return Response({'game': get_game_info(game), 'user': load_user(username=request.user.username)}, status=status.HTTP_200_OK)


def get_room_code():
    choices = string.ascii_uppercase + string.digits
    choices = choices.replace('l', '')
    choices = choices.replace('I', '')

    while True:
        room_code = ''.join(
            random.choice(choices) for i in range(8))
        queryset = Tournament.objects.filter(
            room_code=room_code)
        if not queryset.exists():
            break

    return room_code


def get_game_info(game):
    user = User.objects.filter(username=game.host.username)
    user = user[0]
    players = {}
    me = {}
    charts = {}
    holdings = {}
    contract = {}

    for player, value in game.players.items():
        players[player] = {
            'username': value['username'],
            'first_name': value['first_name'],
            'last_name': value['last_name'],
            'color': value['color']
        }

        if game.start_time != "":
            players[player]['numbers'], players[player]['amount'] = load_portfolio(
                value, game)
            players[player]['cash'] = value['amount']

            if value['username'] == user.username:
                charts = load_charts(value, game)
                if 'holdings' in value:
                    holdings = value['holdings']

    if len(game.contract) != 0:
        contract = game.contract

    return {
        'host': {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        },
        'start_amount': game.start_amount,
        'bet': game.bet,
        'duration': game.duration,
        'room_code': game.room_code,
        'positions': game.positions,
        'players': players,
        'invites': game.invites,
        'active': game.start_time != "",
        'charts': charts,
        'holdings': holdings,
        'contract': contract
    }


def get_symbol_data(symbol, start_time, end_time):
    r = requests.get('https://finnhub.io/api/v1/stock/candle?symbol=' + symbol +
                     '&resolution=5&from=' + start_time + '&to=' + end_time + '&token=' + FINNHUB_API_KEY)

    return r.json()


def format_data_for_graph(data):
    return [{'time': data['t'][i], 'price': data['c'][i]} for i in range(len(data['c']))]


def load_charts(player, game):
    current_time = math.floor(time.time())
    start_time = game.start_time
    charts = {}

    try:
        player['transactions'][1]
    except IndexError:
        return charts

    if current_time - player['transactions'][1]['time'] > 300:
        current_time = str(math.floor(time.time()))
        for transaction in player['transactions'][1:]:
            symbol = transaction['symbol']
            if not symbol in charts and symbol in player['holdings']:
                data = get_symbol_data(symbol, start_time, current_time)
                charts[symbol] = format_data_for_graph(data)

    return charts


def no_transactions_portfolio(game, start_time, end_time):
    numbers = [{'time': start_time, 'price': game.start_amount}]
    count = 0
    current_time = time.time()

    while True:
        if (start_time + (300 * count) <= current_time):
            add = {'time': start_time + (300 * count)}
            add['price'] = game.start_amount
            numbers.append(add)
            count += 1
        else:
            if start_time + (300 * count) <= end_time:
                add = {'time': start_time + (300 * count)}
                add['price'] = None
                numbers.append(add)
                count += 1
            else:
                break

    return numbers, game.start_amount


def get_player_charts(player, start_time, current_time):
    symbol_charts = {}
    times = []

    for t in player['transactions']:
        if 'symbol' in t:
            symbol = t['symbol']
            if not symbol in symbol_charts:
                r = get_symbol_data(symbol, start_time, current_time)
                symbol_charts[symbol] = r['c']
                times.append(r['t'])

    times = max(times, key=len)

    for symbol, data in symbol_charts.items():
        if len(data) < len(times) - 1:
            data.extend([data[-1] for x in range(len(times) - len(data))])

    return times, symbol_charts


def load_portfolio(player, game):
    current_time = math.floor(time.time())
    start_time = int(game.start_time)
    end_time = int(game.end_time)

    if current_time > end_time:
        current_time = end_time

    if len(player['transactions']) == 1:
        return no_transactions_portfolio(game, start_time, end_time)
    elif current_time - player['transactions'][1]['time'] < 300:
        return no_transactions_portfolio(game, start_time, end_time)

    times, symbol_charts = get_player_charts(
        player, str(math.floor(start_time)), str(current_time))
    latest_transaction = 0
    latest_holdings = {}
    latest_amount = game.start_amount
    goal = []
    prev_time = start_time
    standard_time = start_time
    worth = game.start_amount

    goal.append({'time': start_time, 'price': worth})

    for i in range(int((end_time - start_time) / 300)):
        if i >= (len(times)):
            if standard_time > current_time:
                goal.append({'time': standard_time, 'price': None})
            else:
                goal.append({'time': standard_time, 'price': worth})
        else:
            for x in player['transactions']:
                if x['time'] >= prev_time and x['time'] < times[i]:
                    latest_holdings[x['symbol']] = x['total_quantity']
                    latest_amount = x['cash']
            add = {'time': standard_time, 'price': latest_amount}
            for key, value in latest_holdings.items():
                add['price'] += symbol_charts[key][i] * value
            worth = add['price']
            prev_time = times[i]
            goal.append(add)
        standard_time += 300

    return goal, worth


def player_in_game(username):
    game = Tournament.objects.filter(
        players__has_key=username).filter(active=True)

    return game.exists()


def transaction(request, bought, player):
    SYMBOL = request.data["symbol"]
    QUOTE = request.data["quote"]
    quantity = request.data["quantity"]
    current_time = time.time()

    if not request.data['dollars']:
        quantity = QUOTE['c'] * quantity

    if bought:
        cash = player['amount'] - quantity
    else:
        cash = player['amount'] + quantity

    if request.data['dollars']:
        quantity = quantity / QUOTE['c']

    add = {"bought": bought, "symbol": SYMBOL, "quantity": quantity,
           "price": QUOTE['c'], "time": current_time, "cash": cash}

    return SYMBOL, quantity, QUOTE, add


def color_taken(game, color):
    for player, value in game.players.items():
        if value['color'] == color:
            return True

    return False


def get_color(game):
    colors = ['black', 'blue', 'red', 'orange', 'green', 'purple', 'hotpink']
    color = random.choice(colors)

    if color_taken(game, color):
        return get_color(game)

    return color


def get_history(games):
    history = []

    for game in games:
        history.append({
            'players': game.players,
            'start_amount': game.start_amount,
            'bet': game.bet,
            'start_time': game.start_time,
            'duration': game.duration,
            'positions': game.positions
        })

    return history


def game_over(game):
    game.room_code = ''
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
