from datetime import datetime
import time
import math
import requests
from .TopSecret import *

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
