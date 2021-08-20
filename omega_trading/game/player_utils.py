from datetime import datetime as dt
from .TopSecret import *
from .models import *
from .utils import *
import requests
import math
import time


GAME_LENGTH = {
    'day': {
        'name': 'day',
        'length': SECONDS_IN_DAY,
        'resolution': '5',
        'periods': 300,
    },
    'week': {
        'name': 'week',
        'length': SECONDS_IN_WEEK,
        'resolution': '60',
        'periods': SECONDS_IN_HOUR,
    },
    'month': {
        'name': 'month',
        'length': SECONDS_IN_MONTH,
        'resolution': '60',
        'periods': SECONDS_IN_HOUR,
    },
    '3m': {
        'name': '3m',
        'length': SECONDS_IN_MONTH,
        'resolution': 'D',
        'periods': SECONDS_IN_DAY,
    }
}


# # # # # # # # #
#   PORTFOLIO   #
# # # # # # # # #


def load_portfolio(player, game, length):
    PERIOD = length['periods']

    start_time, end_time = get_times(game, length)

    transactions, holdings, cash = get_positions(game, player, start_time)

    if len(transactions) == 1:
        return no_transactions_portfolio(game, start_time, end_time)
    if end_time - start_time < length['length']:
        return no_transactions_portfolio(game, start_time, end_time)

    times, symbol_charts = get_player_charts(player, str(start_time), str(end_time), length)

    goal = []
    prev_time = start_time
    standard_time = start_time

    goal.append({'time': start_time - PERIOD, 'price': cash})

    for i in range(int((end_time - start_time) / PERIOD)):
        if i >= (len(times)):
            if standard_time > end_time:
                goal.append({'time': standard_time, 'price': None})
            else:
                goal.append({'time': standard_time, 'price': worth})
        else:
            for x in transactions:
                if x['time'] >= prev_time and x['time'] < times[i]:
                    holdings[x['symbol']] = x['total_quantity']
                    cash = x['cash']
            add = {'time': standard_time, 'price': cash}
            for key, value in holdings.items():
                add['price'] += symbol_charts[key][i] * value
            worth = add['price']
            prev_time = times[i]
            goal.append(add)
        standard_time += PERIOD

    path_string, periods = format_data_for_svg(goal)

    return path_string, periods, worth

def get_times(game, length):
    end_time =  math.floor(time.time())
    start_time = end_time - length['length']

    if start_time < game.start_time:
        start_time = game.start_time

    return start_time, end_time

def get_positions(game, player, start_time):
    transactions = Transactions.objects.filter(player_id=player.id).values()
    period_transactions = []
    holdings = {}
    cash = game.start_amount

    for _, transaction in enumerate(transactions):
        if transaction['quantity'] != 0:
            if transaction['time'] <= start_time:
                holdings[transaction['symbol']] = transaction['total_quantity']
                cash = transaction['cash']
            else:
                period_transactions.append(transaction)
    
    return period_transactions, holdings, cash

def get_symbol_data(symbol, start_time, end_time, res):
    r = requests.get('https://finnhub.io/api/v1/stock/candle?symbol=' + symbol +
                     '&resolution=' + res + '&from=' + start_time + '&to=' + end_time + '&token=' + FINNHUB_API_KEY)

    return r.json()

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

def get_player_charts(player, start_time, current_time, length):
    res = length['resolution']
    symbol_charts = {}
    times = []

    transactions = get_transactions(player)

    for transaction in transactions:
        if 'symbol' in transaction:
            symbol = transaction['symbol']
            if not symbol in symbol_charts:
                r = get_symbol_data(symbol, start_time, current_time, res)
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

def format_time(time):
    time = dt.fromtimestamp(time)
    
    return {
        'year': time.year,
        'month': time.month,
        'day': time.day,
        'hours': time.hour,
        'minutes': time.minute
    }

def format_data_for_svg(numbers, width=676, height=250):
    WIDTH = width
    HEIGHT = height
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
            if numbers[i]['price'] != None:
                periods.append(
                    {'time': format_time(numbers[i]['time']), 'price': numbers[i]
                    ['price'], 'x': coor[i]['x'], 'y': coor[i]['y']}
                )

            count += 1

    return path_string, periods

def game_length(game):
    time_since_start = math.floor(time.time()) - game.start_time

    if time_since_start < SECONDS_IN_DAY:
        if game.end_time - game.start_time > SECONDS_IN_DAY:
            return [GAME_LENGTH['day']]
        else:
            return [{
                'name': 'live',
                'length': game.end_time - game.start_time,
                'resolution': '5',
                'periods': 300,
            }]
    else:
        lengths = [GAME_LENGTH['day']]
        length = game.end_time - game.start_time        

        if length > SECONDS_IN_WEEK and time_since_start > SECONDS_IN_WEEK:
            lengths.append(GAME_LENGTH['week'])
            lengths.append({
                'name': 'max',
                'length': game.end_time - game.start_time,
                'resolution': 'D',
                'periods': SECONDS_IN_DAY,
            })

        if length > SECONDS_IN_MONTH and time_since_start > SECONDS_IN_MONTH: 
            lengths.append(GAME_LENGTH['month'])
        
        if length > (SECONDS_IN_MONTH * 3) and time_since_start > (SECONDS_IN_MONTH * 3):
            lengths.append(GAME_LENGTH['3m'])

        return lengths


# # # # # # # # #
#   PORTFOLIO   #
# # # # # # # # #

def get_player(user, game):
    player = Player.objects.filter(user_id=user.id, game_id=game.id)

    return player[0]

def symbol_charts(user, game):
    player = get_player(user, game)
    holdings = Holdings.objects.filter(player_id=player.id)
    start_time = time.localtime()
    start_time = (start_time[0], start_time[1], start_time[2], 9, 30, 00, start_time[6], start_time[7], start_time[8])
    start_time = math.floor(time.mktime(start_time))
    end_time = math.floor(time.time())
    charts = {}

    for holding in holdings:
        data = get_symbol_data(holding.symbol, start_time, end_time, '5')
        data = [{'price': data['c'][i], 'time': data['t'][i]} for i in range(len(data['t']))] 
        charts[holding.symbol] = {
            'path': format_data_for_svg(data, 64, 30),
            'last_price': data[-1]['price']
            }
    return charts

def player_holdings(player):
    holdings = Holdings.objects.filter(player_id=player.id)
    dict_holdings = {}

    for holding in holdings:
        dict_holdings[holding.symbol] = holding.quantity

    return dict_holdings

def player_info(game, user):
    player = Player.objects.filter(user_id=user.id, game_id=game.id)
    player = player[0]
    lengths = game_length(game)
    portfolio = []

    for length in lengths:
        path, periods, cash = load_portfolio(player, game, length)
        portfolio.append(
            {
                'name': length['name'],
                'path': path,
                'periods': periods,
                'cash': cash
            }
        )

    return {
        'game': game.room_code,
        'portfolio': portfolio,
        'small_charts': symbol_charts(user, game),
        'holdings': player_holdings(player)
    }
    
