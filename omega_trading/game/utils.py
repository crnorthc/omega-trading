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


def load_user(request=None, username=None):
    if request == None:
        queryList = User.objects.filter(username=username)
        user = queryList[0]
    else:
        user = request.user
    username = user.username
    first_name = user.first_name
    last_name = user.last_name
    email = user.email
    profile = Profile.objects.filter(user_id=user.id)
    profile = profile[0]
    portfolio_amount = profile.portfolio_amount
    securities = profile.holdings
    response = {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "portfolio_amount": portfolio_amount,
        "holdings": securities
    }
    response['invites'] = profile.invites
    response['friends'] = profile.friends
    return response


def get_game(room_code):
    game = Tournament.objects.filter(room_code=room_code)
    if game.exists():
        game = game[0]
        return game
    return Response({"Error": "No Room Found"}, status=status.HTTP_404_NOT_FOUND)


def uninvite(profile, username, room_code):
    game = Tournament.objects.filter(room_code=room_code)
    game = game[0]
    if username in game.invites:
        del game.invites[username]
    if room_code in profile.invites:
        del profile.invites[room_code]
    return game, profile


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
    for player, value in game.players.items():
        if value['username'] == user.username:
            me = value
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
            charts = load_charts(me, game)
            if 'holdings' in me:
                holdings = me['holdings']

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
        'holdings': holdings
    }


def load_charts(player, game):
    current_time = math.floor(time.time())
    start_time = game.start_time
    charts = {}
    if 'transactions' in player:
        try:
            player['transactions'][1]
        except IndexError:
            return charts
        if current_time - player['transactions'][1]['time'] > 300:
            current_time = str(math.floor(time.time()))
            for t in player['transactions']:
                if 'symbol' in t:
                    s = t['symbol']
                    if not s in charts and s in player['holdings']:
                        r = requests.get(
                            'https://finnhub.io/api/v1/stock/candle?symbol=' + s + '&resolution=5&from=' + start_time + '&to=' + current_time + '&token=' + FINNHUB_API_KEY)
                        r = r.json()
                        charts[s] = []
                        for i in range(len(r['t']) - 1):
                            charts[s].append(
                                {'time': r['t'][i], 'price': r['c'][i]})
    return charts


def load_portfolio(player, game):
    current_time = math.floor(time.time())
    start_time = int(game.start_time)
    end_time = int(game.end_time)

    if current_time > end_time:
        current_time = end_time

    # Part 3: Generate the lists of prices for each symbol owned
    temp = {}
    times = []

    # When player has no transactions
    try:
        if current_time - player['transactions'][1]['time'] < 300:
            numbers = []
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
    except IndexError:
        numbers = []
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

    # Generates the list of prices for each symbol
    for t in player['transactions']:
        if 'symbol' in t:
            s = t['symbol']
            if not s in temp:
                r = requests.get(
                    'https://finnhub.io/api/v1/stock/candle?symbol=' + s + '&resolution=5&from=' + str(math.floor(start_time)) + '&to=' + str(current_time) + '&token=' + FINNHUB_API_KEY)
                r = r.json()
                temp[s] = r['c']
                times.append(r['t'])
    times = min(times, key=len)

    # transforms each list of symbol prices to uniform length
    for key, value in temp.items():
        temp[key] = temp[key][(-1) * len(times):]

    latest_transaction = 0
    latest_holdings = {}
    latest_amount = game.start_amount
    goal = []
    prev_time = times[0]
    standard_time = start_time
    worth = game.start_amount
    for i in range(1, int((end_time - start_time) / 300)):
        if i >= (len(times)):
            if standard_time > current_time:
                goal.append({'time': standard_time, 'price': None})
            else:
                goal.append({'time': standard_time, 'price': worth})
        else:
            for x in player['transactions']:
                if x['time'] >= prev_time and x['time'] < times[i]:
                    latest_transaction = i
                    latest_holdings[x['symbol']] = x['total_quantity']
                    latest_amount = x['cash']
            add = {'time': standard_time, 'price': latest_amount}
            for key, value in latest_holdings.items():
                add['price'] += temp[key][i] * value
            worth = add['price']
            goal.append(add)
        standard_time += 300
    return goal, worth


def player_in_game(username):
    game = Tournament.objects.filter(
        players__has_key=username).filter(active=True)
    return game.exists()


def transaction(request, bought, player):
    symbol = request.data["symbol"]
    quantity = request.data["quantity"]
    quote = request.data["quote"]

    current_time = time.time()

    if request.data['dollars']:
        quantity = quantity
    else:
        quantity = quote['c'] * quantity

    if bought:
        cash = player['amount'] - quantity
    else:
        cash = player['amount'] + quantity

    if request.data['dollars']:
        quantity = quantity / quote['c']

    add = {"bought": bought, "symbol": symbol, "quantity": quantity,
           "price": quote['c'], "time": current_time, "cash": cash}

    return symbol, quantity, quote, add


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
    temp = {}
    for game in games:
        temp[game['room_code']] = {
            'players': game['players'],
            'start_amount': game['start_amount'],
            'bet': game['bet'],
            'start_time': game['start_time'],
            'end_time': game['end_time']
        }
    return temp
