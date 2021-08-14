from django.contrib.auth.models import User
from django.apps import apps
from .TopSecret import *
from .bets import *
from rest_framework.response import Response
from rest_framework import status
from .models import *
import random
import string
import math
import time
import requests
import datetime

Invites = apps.get_model('users', 'Invites')
SECONDS_IN_DAY = 24 * 60 * 60
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MINUTE = 60


def load_user(request=None, username=None):
    if request == None:
        queryList = User.objects.filter(username=username)
        user = queryList[0]
    else:
        user = request.user

    response = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }

    return response

def get_user(id):
    user = User.objects.filter(id=id)

    return user[0]

def uninvite(username, room_code):
    user = User.objects.filter(username=username)
    user = user[0]
    game = get_game(room_code)
    invite = Invites.objects.filter(receiever=user, game=game)
    invite = invite[0]

    invite.delete()

    return get_game_info(game, user)

def remove_player(request):
    username = request.data['username']
    user = User.objects.filter(username=username)
    user = user[0]
    player = get_player(user)
    room_code = request.data['room_code']
    game = get_game(room_code)

    player.delete()

    return Response({'game': get_game_info(game, user), 'user': load_user(username=request.user.username)}, status=status.HTTP_200_OK)

def get_host_username(game):
    host = Player.objects.filter(is_host=True, game_id=game.id)
    host = host[0]
    host = User.objects.filter(id=host.user_id)
    host = host[0]

    return host.username

def get_room_code():
    choices = string.ascii_uppercase + string.digits
    choices = choices.replace('l', '')
    choices = choices.replace('I', '')

    while True:
        room_code = ''.join(
            random.choice(choices) for i in range(8))
        queryset = Game.objects.filter(
            room_code=room_code)
        if not queryset.exists():
            break

    return room_code

def get_player(user):
    player = Player.objects.filter(user=user)

    if player.exists():
        return player[0]
    else:
        return player

def get_players(game):
    players = Player.objects.filter(game_id=game.id).values()
    formatted_players = {}

    for _, value in enumerate(players):
        user = User.objects.filter(id=value['user_id'])
        user = user[0]

        value['first_name'] = user.first_name
        value['last_name'] = user.last_name
        formatted_players[user.username] = value
        
        if value['is_host']:
            host = {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name
            }

    return formatted_players, host

def get_holdings(player):
    holdings = Holdings.objects.filter(player_id=player.id).values()
    player_holdings = {}

    for _, holding in enumerate(holdings):
        player_holdings[holding['symbol']] = holding['quantity']

    return player_holdings

def get_players_info(game, player):
    players = {}
    charts = {}
    holdings = {}

    user = get_user(player.user_id)

    players_data, host = get_players(game)

    for username, player in players_data.items():
        players[username] = {
            'username': username,
            'first_name': player['first_name'],
            'last_name': player['last_name']
        }

        if 'address' in player:
            players[username]['address'] = player['address']

        if game.start_time != 0:
            players[username]['path'], players[username]['periods'], players[username]['worth'] = load_portfolio(
                player, game)
            players[username]['cash'] = player['cash']

            if player == user.username:
                holdings = Holdings.objects.filter(player_id=player.id)

                if holdings.exists():
                    charts = load_charts(player, game)
                    holdings = get_holdings(player)
                

    return players, charts, holdings, host

def contract_players(game):
    players = get_players(game)
    contract_info = {}

    for username, player in players.items():
        contract_info[username] = {
            'address': player['address'],
            'key': player['key'],
            'payed': player['payed'],
            'ready': player['ready']
        }

    return contract_info

def get_invites(game):
    invites = Invites.objects.filter(game_id=game.id)
    formatted_invites = {}

    if invites.exists():
        for _, invite in enumerate(invites.values()):
            sender = get_user(invite['sender_id'])
            receiever = get_user(invite['receiever_id'])
            formatted_invites[receiever.username] = {
                'sender': sender.username,
                'first_name': receiever.first_name,
                'last_name': receiever.last_name
            }

    return formatted_invites

def get_duration(game):
    duration = Duration.objects.filter(id=game.duration_id)
    duration = duration[0]

    return {
        'days': duration.days,
        'hours': duration.hours,
        'mins': duration.minutes
    }

def get_end_time(end_time):
    end_time = time.localtime(end_time)

    hour = end_time[3] + 1

    type = 'AM'

    if hour > 12:
        hour = hour - 12
        type = 'PM'

    return {
        'year': end_time[0],
        'month': end_time[1],
        'day': end_time[2],
        'hour': hour,
        'minute': end_time[4],
        'type': type
    }

def get_duration(game):
    duration = Duration.objects.filter(id=game.duration_id)
    duration = duration[0]

    return {
        'days': duration.days,
        'hours': duration.hours,
        'mins': duration.minutes
    }

def get_game_info(game, user):
    host = User.objects.filter(username=user.username)
    host = host[0]
    player = get_player(user)
    players, charts, holdings, host = get_players_info(game, player)

    info = {
        'host': host,
        'name': game.name,
        'type': game.public,
        'start_amount': game.start_amount,
        'room_code': game.room_code,
        'commission': game.commission,
        'options': game.options,
        'players': players,
        'invites': get_invites(game),
        'active': game.start_time != "",
        'charts': charts,
        'holdings': holdings
    }

    if game.duration_id == None:
        info['time'] = get_end_time(game.end_time)
    else:
        info['duration'] = get_duration(game)

    return info

def get_symbol_data(symbol, start_time, end_time):
    r = requests.get('https://finnhub.io/api/v1/stock/candle?symbol=' + symbol +
                     '&resolution=5&from=' + start_time + '&to=' + end_time + '&token=' + FINNHUB_API_KEY)

    return r.json()

def format_data_for_graph(data):
    return [{'time': data['t'][i], 'price': data['c'][i]} for i in range(len(data['c']))]

def get_transactions(player):
    transactions = Transactions.objects.filter(player_id=player.id).values()
    formatted_transactions = []

    for _, transaction in enumerate(transactions):
        formatted_transactions.append(transaction)
    
    return formatted_transactions

def load_charts(player, game):
    current_time = math.floor(time.time())
    start_time = game.start_time    
    transactions = get_transactions(player)
    holdings = get_holdings(player)
    charts = {}

    try:
        transactions[1]
    except IndexError:
        return charts

    if current_time - transactions[1]['time'] > 300:
        current_time = str(math.floor(time.time()))
        for transaction in transactions[1:]:
            symbol = transaction['symbol']
            if not symbol in charts and symbol in holdings:
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

    string_path, periods = format_data_for_svg(numbers)

    return string_path, periods, game.start_amount

def get_player_charts(player, start_time, current_time):
    symbol_charts = {}
    times = []

    transactions = get_transactions(player)

    for transaction in transactions:
        if 'symbol' in transaction:
            symbol = transaction['symbol']
            if not symbol in symbol_charts:
                r = get_symbol_data(symbol, start_time, current_time)
                symbol_charts[symbol] = r['c']
                times.append(r['t'])

    times = max(times, key=len)

    for symbol, data in symbol_charts.items():
        if len(data) < len(times) - 1:
            data.extend([data[-1] for x in range(len(times) - len(data))])

    return times, symbol_charts

def getMinMax(numbers):
    Min = numbers[0]['price']
    Max = 0

    for number in numbers:
        if number['price'] == None:
            break

        if number['price'] > Max:
            Max = number['price']

        if number['price'] < Min:
            Min = number['price']

    return Min, Max

def format_data_for_svg(numbers):
    WIDTH = 676
    HEIGHT = 250
    HALF_HEIGHT = HEIGHT / 2
    DISTANCE = WIDTH / (len(numbers) - 1)
    MIN, MAX = getMinMax(numbers)
    START_AMOUNT = numbers[0]['price']

    def getY(price):
        if price == None:
            return None

        if price == START_AMOUNT:
            return HALF_HEIGHT

        if price > START_AMOUNT:
            return HALF_HEIGHT - (((price - START_AMOUNT) / (MAX - START_AMOUNT)) * 100)

        if price < START_AMOUNT:
            return HALF_HEIGHT + (((START_AMOUNT - price) / (START_AMOUNT - MIN)) * 100)

    x = 0
    y = 125

    path_string = 'M {x} {y}'.format(x=str(x), y=str(y))

    coor = [{'x': x, 'y': y}]

    for i in range(1, len(numbers)):
        x = i * DISTANCE
        y = getY(numbers[i]['price'])

        coor.append({'x': x, 'y': y})

        if numbers[i]['price'] != None:
            path_string = path_string + ' L {x} {y}'.format(x=str(x), y=str(y))

    periods = []
    count = 0

    for i in range(len(coor)):
        while coor[i]['x'] >= count:
            periods.append(
                {'time': numbers[i]['time'], 'price': numbers[i]
                 ['price'], 'x': coor[i]['x'], 'y': coor[i]['y']}
            )

            count += 1

    return path_string, periods

def load_portfolio(player, game):
    current_time = math.floor(time.time())
    start_time = int(game.start_time)
    end_time = int(game.end_time)

    if current_time > end_time:
        current_time = end_time

    transactions = get_transactions(player)

    if len(transactions) == 1:
        return no_transactions_portfolio(game, start_time, end_time)
    elif current_time - transactions[1]['time'] < 300:
        return no_transactions_portfolio(game, start_time, end_time)

    times, symbol_charts = get_player_charts(
        player, str(math.floor(start_time)), str(current_time))
    latest_holdings = {}
    latest_amount = game.start_amount
    goal = []
    prev_time = start_time
    standard_time = start_time
    worth = game.start_amount

    goal.append({'time': start_time - 300, 'price': worth})

    for i in range(int((end_time - start_time) / 300)):
        if i >= (len(times)):
            if standard_time > current_time:
                goal.append({'time': standard_time, 'price': None})
            else:
                goal.append({'time': standard_time, 'price': worth})
        else:
            for x in transactions:
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

    path_string, periods = format_data_for_svg(goal)

    return path_string, periods, worth

def player_in_game(username):
    user = User.objects.filter(username=username)
    user = user[0]
    player = Player.objects.filter(user=user)

    return player.exists()

def transaction(request, bought, player):
    SYMBOL = request.data["symbol"]
    QUOTE = request.data["quote"]
    quantity = request.data["quantity"]
    current_time = time.time()

    if not request.data['dollars']:
        quantity = QUOTE['c'] * quantity

    if bought:
        cash = player['cash'] - quantity
    else:
        cash = player['cash'] + quantity

    if request.data['dollars']:
        quantity = quantity / QUOTE['c']

    transaction = Transactions(bought=bought, symbol=SYMBOL, quantity=round(quantity, 10), price=round(QUOTE['c'], 3), time=round(current_time, 5), cash=round(cash, 4))

    return SYMBOL, quantity, QUOTE, transaction

def get_history_players(game):
    players_info = []
    players = PlayerHistory.objects.filter(history_id=game.id).values()

    for _, player in enumerate(players):
        user = get_user(player['user_id'])

        players_info.append = {
            'username': user.username,
            'worth': player['cash']
        }

    return players_info

def get_history(games):
    history = []

    for game in games:
        game = History.objects.filter(id=game.history_id)
        game = game[0]
        history.append({
            'players': get_history_players(game),
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

    winner = save_game_history(game)

    if 'address' in game.contract:
        contract = get_contract(game)
        pay_winner(contract.contract['address'], contract.contract['abi'], winner)

    delete_game(game)

    return Response({'Error': "No Game Found"}, status=status.HTTP_204_NO_CONTENT)

# Will be changed
def get_address(request, game):
    profile = Profile.objects.filter(user_id=request.user.id)
    profile = profile[0]
    player = Player.objects.filter(profile_id=profile.id)
    player = player[0]
    contract = get_contract_info(game)

    if 'save' in request.data:
        if request.data['save']:
            player.address = request.data['address']
            player.save()

    if 'address' in request.data:
        addy = str(request.data['address'])
    else:
        if request.user.username in contract['players']:
            addy = contract['players'][request.user.username]['address']
        else:
            addy = player.address

    if not check_address(addy):
        return False
    else:
        return checkedsummed(addy)

def all_bets_made(game):
    contract = get_contract_info(game)

    for _, value in contract['players'].items():
        if not value['payed']:
            return False

    return True

def ready_to_start(game):
    contract = get_contract_info(game)

    for _, value in contract['players'].items():
        if not value['ready']:
            return False

    return True

def initial_transactions(game):
    current_day = time.localtime()
    current_day = (current_day[0], current_day[1], current_day[2], 1,
                    00, 00, current_day[6], current_day[7], current_day[8])
    current_day = math.floor(time.mktime(current_day)) - SECONDS_IN_DAY
    players = get_players(game)

    for username, player in players.items():
        user = User.objects.filter(username=username)
        user = user[0]
        transaction = Transactions(player=get_player(user), bought=True, symbol='', quantity='', price=0, time=round((time.time() - SECONDS_IN_DAY), 5), cash=game.start_amount, total_quantity=0)
        transaction.save()

def get_game(user):
    player = get_player(user)
    if player.exists():
        player = player[0]
        game = Game.objects.filter(id=player.game_id)
        return game
    else:
        return player

def save_game_history(game):
    duration = get_duration(game)
    players = get_players(game)

    history = History(start_amount=game.start_amount, bet=game.bet, start_time=game.start_time, positions=game.positions, duration=duration)
    history.save()

    winner = {'player': None, 'cash': 0}

    for username, player in players.items():
        user = get_user(player['user_id'])
        cash = get_player_cash(player, game.end_time)

        if cash > winner['cash']:
            winner = {'player': player['address'], 'cash': cash}

        player_history = PlayerHistory(history=history, user=user, cash=cash)
        player_history.save()

    return winner['player']

def delete_game(game):
    players = get_players(game)

    for username, player in players.items():
        transactions = Transactions.objects.filter(player_id=player['id'])
        holdings = Holdings.objects.filter(player_id=player['id'])
        duration = Duration.objects.filter(id=game.duration_id)
        player = Player.objects.filter(id=player['id'])
        game = Game.objects.filter(id=game.id)

        for transaction in transactions:
            transaction.delete()

        for holding in holdings:
            holding.delete()

        if game.is_contract:
            contract = get_contract(game)
            contract.delete()

        player.delete()

    game.delete()
    duration.delete()

def get_player_cash(player, time):
    player = Player.objects.filter(id=player['id'])
    player = player[0]
    holdings = get_holdings(player)
    cash = player.cash

    for symbol, quantity in holdings.items():
        cash += (get_symbol_quote(symbol, math.floor(time)) * quantity)

    return cash

def get_symbol_quote(symbol, time):
    r = requests.get(
            'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY)

    r = r.json()

    return r['c']

def format_duration(game_value):
    return {
        'days': game_value['days'],
        'hours': game_value['hours'],
        'mins': game_value['minutes']
    }

def formulate_query(request):
    amounts = request.data['metrics']['amounts']
    commissions = request.data['metrics']['commission']
    ebet = request.data['metrics']['ebet']
    date = request.data['metrics']['date']
    duration = request.data['metrics']['duration']
    options = request.data['metrics']['options']

    if options:
        options = 'TRUE'
    else:
        options = 'FALSE'

    date_query = get_date_query(date)

    duration_query = ''
    if duration != None:
        duration_query = 'FULL JOIN game_duration ON game.duration_id=game_duration.id'

    crypto_query = ebet_query(ebet, options)

    amount = amounts_query(amounts)
    commission = commissions_query(commissions)

    return 'SELECT * FROM ' \
            '({crypto}) AS game ' \
            '{duration} ' \
            'WHERE {date}{amount}{commission}'.format(duration=duration_query, crypto=crypto_query, date=date_query, amount=amount, commission=commission)

def matching_duration(game, duration):
    days = game.days
    hours = game.hours
    mins = game.minutes

    if duration != None:
        day = duration['days']
        hour = duration['hours']
        min = duration['mins']

        if day != 'any':
            if hour != 'any':
                if min != 'any':
                    if day == days and hours == hour and mins == min:
                        return True
                else:
                    if day == days and hours == hour:
                        return True
            else:
                if day == days:
                    return True
        else:
            return True
    else:
        return True

    return False

def get_results(games, duration):
    results = []

    for _, game in enumerate(games):
            duration_match = matching_duration(game, duration)

            if duration_match:
                players = Player.objects.filter(game_id=game.id).count()

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

                results.append(info)

    return results

def date_to_UNIX(date):
    month = int(date['month'])
    day = int(date['day'])
    year = int(date['year'])
    hour = int(date['hour'])
    min = int(date['min'])
    type = date['type']

    if type == 'PM': 
        hour += 12

    return int(datetime.datetime(year, month, day, hour=hour, minute=min).timestamp())

def UNIX_range(date):

    if date['year'] == 'any':
        return 'any'
    else:
        month = int(date['month'])
        day = int(date['day'])
        year = int(date['year'])


        if date['hour'] == 'any':            
            return {
                'min': int(datetime.datetime(year, month, day, 0).timestamp()),
                'max': int(datetime.datetime(year, month, day, 23).timestamp())
                }
        else:
            hour = int(date['hour'])
            min = int(date['min'])
            type = date['type']

            if type == 'PM': 
                hour += 12

            return {'value': int(datetime.datetime(year, month, day, hour=hour, minute=min).timestamp())}

def get_date_query(date):
    if date != None:
        range = UNIX_range(date)
        if range == 'any':
            return 'game.end_time!=0'
        else:
            if 'min' in range:
                return 'game.end_time>={floor} AND game.end_time<={ceil}'.format(floor=range['min'], ceil=range['max'])
            else:
                return 'game.end_time={time}'.format(time=range['value'])
    else:
        return 'game.end_time=0'

def ebet_query(ebet, options):
    if ebet != None:
        crypto_query = '1=1'
        if ebet['crypto'] != 'any':
            crypto_query = 'crypto=' + ebet['crypto']

        if ebet['amount'] == 'any':
            return 'SELECT * FROM ' \
                    '('\
                        'SELECT * FROM game_game ' \
                        'WHERE public=TRUE AND options={options} AND active=FALSE '\
                    ') AS game'\
                    'FULL JOIN game_ebet ON game.id=game_ebet ' \
                    'WHERE {crypto}'.format(options=options, crypto=crypto_query)
        else:
            return 'SELECT * FROM '\
                    '('\
                        'SELECT * FROM game_game ' \
                        'WHERE public=TRUE AND options={options} AND active=FALSE'\
                    ') AS game' \
                    'FULL JOIN game_ebet ON game.id=game_ebet ' \
                    'WHERE {crypto} AND game_ebet.bet >= {floor} AND game_ebet.bet <= {ceil}'.format(floor=ebet['min'], ceil=ebet['max'], crypto=crypto_query, options=options)
    else:
        return 'SELECT * FROM game_game ' \
                'WHERE public=TRUE AND options={options} AND active=FALSE'.format(options=options)

def amounts_query(amounts):
    query = ''

    if amounts == 'any':
        return query
    
    for amount in amounts:
        amount = amount[1:].replace(',','')

        query += ' AND game_game.start_amount={amount}'.format(amount=amount)

    return query

def commissions_query(commissions):
    query = ''
    
    if commissions == 'any':
        return query

    for commission in commissions:
        commission = float(commission[1:])

        query += ' AND game.commission={commission}'.format(commission=commission)

    return query



