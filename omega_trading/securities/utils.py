from datetime import datetime
import time
import math
import requests
from .TopSecret import *

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
SECONDS_IN_YEAR = 365 * 24 * 60 * 60
SECONDS_IN_MONTH = 30 * 24 * 60 * 60
SECONDS_IN_WEEK = 7 * 24 * 60 * 60
SECONDS_IN_DAY = 24 * 60 * 60
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MINUTE = 60

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
    time = datetime.fromtimestamp(time)
    
    return {
        'year': time.year,
        'month': time.month,
        'day': time.day,
        'hours': time.hour,
        'minutes': time.minute
    }

def format_data_for_svg(numbers, period, width, height):
    numbers = format_data(numbers, period)
    HALF_HEIGHT = height / 2
    MAX_Y = height * .8
    DISTANCE = width / (len(numbers) - 1)
    MIN, MAX = getMinMax(numbers)
    START_AMOUNT = numbers[0]['price']

    def getY(price):
        if price == None:
            return None

        if price == START_AMOUNT:
            return HALF_HEIGHT

        if price > START_AMOUNT:
            return HALF_HEIGHT - (((price - START_AMOUNT) / (MAX - START_AMOUNT)) * (MAX_Y / 2))

        if price < START_AMOUNT:
            return HALF_HEIGHT + (((START_AMOUNT - price) / (START_AMOUNT - MIN)) * (MAX_Y / 2))

    x = 0
    y = HALF_HEIGHT

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
                {'time': format_time(numbers[i]['time']), 'price': numbers[i]
                 ['price'], 'x': coor[i]['x'], 'y': coor[i]['y']}
            )

            count += 1

    return path_string, periods

def get_period(period):
    current_time = time.time()
    if period == "day":
        start_time = time.localtime()
        start_time = (start_time[0], start_time[1], start_time[2], 8,
                        00, 00, start_time[6], start_time[7], start_time[8])
        start_time = math.floor(time.mktime(start_time))
        resolution = "5"
        r = requests.get(
            'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=' + resolution + '&from=' + str(start_time) + '&to=' + str(math.floor(current_time)) + '&token=' + FINNHUB_API_KEY)
        r = r.json()
        while True:
            if r['s'] == "no_data":
                start_time -= 86400
                current_time = start_time + 32400
                r = requests.get(
                    'https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=' + resolution + '&from=' + str(start_time) + '&to=' + str(math.floor(current_time)) + '&token=' + FINNHUB_API_KEY)
                r = r.json()
            else:
                break
    else:
        start_time = time.localtime()
        start_time = (start_time[0], start_time[1], start_time[2], 9,
                        30, 00, start_time[6], start_time[7], start_time[8])
        start_time = math.floor(time.mktime(start_time))

        if period == "week":
            start_time = start_time - 604800
            resolution = "15"
        if period == "month":
            start_time = start_time - 2592000
            resolution = "60"
        if period == "3m":
            start_time = start_time - 7776000
            resolution = "D"
        if period == "y":
            start_time = start_time - 31536000
            resolution = "D"
        if period == "5y":
            start_time = start_time - 157680000
            resolution = "W"

    current_time = str(math.floor(current_time))
    start_time = str(start_time)

    return start_time, current_time, resolution 

def format_data(numbers, period):
    formatted_data = []

    for i in range(len(numbers['t'])):
        formatted_data.append({'time': numbers['t'][i], 'price': numbers['c'][i]})


    if period == 'day':
        formatted_data = day_numbers(formatted_data)
        
    return formatted_data

def day_numbers(numbers):
    start_time = min(value['time'] for value in numbers)
    current_time = time.localtime(start_time)
    end_time = (current_time[0], current_time[1], current_time[2], 5,
                      30, 00, current_time[6], current_time[7], current_time[8])
    end_time = math.floor(time.mktime(end_time))
    count = 0

    for period in range(start_time, end_time + 1, 300):
        if period > numbers[count]['time']:
            numbers.append({'time': period, 'price': None})

    return numbers

def get_quote(symbol):
    r = requests.get(
            'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY)
    r = r.json()

    return r['c']

def div_yield(symbol):
    start_time = time.localtime()
    start = ('{year}-{month}-{day}').format(year=start_time[0], month=start_time[1], day=start_time[2])
    end = ('{year}-{month}-{day}').format(year=(start_time[0]  - 1), month=start_time[1], day=start_time[2])
    quote = get_quote(symbol)

    divs = requests.get('https://finnhub.io/api/v1/stock/dividend?symbol={symbol}&from={start}&to={end}&token={token}'.format(symbol=symbol, start=start, end=end, token=SANDBOX_KEY))
    divs = divs.json()
    div = 0

    for dividend in divs:
        div += dividend['amount']

    return div / quote

def strike_price_range(price):
    RANGE = price * .2

    if RANGE >= 50:
        return [x for x in range(round(price - RANGE), round(price + RANGE), 10)]
    else:
        return [x for x in range(round(price - RANGE), round(price + RANGE), 1)]

def format_date(timestamp):
    date, timestamp = this_friday(timestamp)
    current_date = time.localtime()
    current_time = time.time()

    if date[0] == current_date[0]:
        year = None
    else:
        year = date[0]

    days_until = round((timestamp - current_time) / SECONDS_IN_DAY)

    return {
        'day': date[2],
        'month': MONTHS[date[1] - 1],
        'year': year,
        'days_until': days_until
    }, timestamp

def this_friday(timestamp, days_until=False):
    date = time.localtime(timestamp)

    if date[6] == 5:
        days = 6
    elif date[6] == 6:
        days = 5
    else: 
        days = 4 - date[6]

    date = time.mktime(date)
    date += (SECONDS_IN_DAY * days)

    if days_until:
        return days

    return time.localtime(date), date

def friday_two_months(timestamp):
    date = time.localtime(timestamp)
    year = date[0]
    
    if date[1] == 11 or date[1] == 12:
        year += 1
    
    month = 12 - (12 % (date[1] + 2))
    date = (year, month, 15, date[3], date[4], date[5], date[6], date[7], date[8])

    return format_date(time.mktime(date))
    
def friday_next_month(timestamp):
    date = time.localtime(timestamp)
    year = date[0]
    
    if date[1] == 12:
        year += 1
    
    month = 12 - (12 % (date[1] + 1))

    date = (year, month, 15, date[3], date[4], date[5], date[6], date[7], date[8])

    return format_date(time.mktime(date))

def get_months(timestamp):
    months = [1, 3, 6, 9]
    return_data = []

    for month in months:
        date = time.localtime(timestamp)
        date = (date[0], month, 15, date[3], date[4], date[5], date[6], date[7], date[8])

        formatted_date, _ = format_date(time.mktime(date))

        return_data.append(formatted_date)

    return return_data