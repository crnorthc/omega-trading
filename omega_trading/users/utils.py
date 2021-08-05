from .TopSecret import *
from django.db import connection
from rest_framework.response import Response
from rest_framework import status
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models import Q
from django.apps import apps
import ssl
import smtplib
import datetime
import time
import math
import random
import string
import requests
from datetime import datetime, timedelta

SECONDS_IN_DAY = 24 * 60 * 60
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MINUTE = 60

Tournament = apps.get_model('game', 'Tournament')

def determine_portfolio_period(period):
    current_time = math.floor(time.time())
    start_time = time.localtime()

    if period == "day":
        start_time = (start_time[0], start_time[1], start_time[2], 8,
                      30, 00, start_time[6], start_time[7], start_time[8])
        end_time = (start_time[0], start_time[1], start_time[2], 5,
                      30, 00, start_time[6], start_time[7], start_time[8])
        end_time = math.floor(time.mktime(end_time))
        start_time = math.floor(time.mktime(start_time))

        if end_time > current_time:
            end_time = current_time

        resolution = "5"
        r = get_symbol_data('AAPL', resolution, start_time, math.floor(end_time))

        while True:
            if 'error' in r:
                time.sleep(1)
                r = get_symbol_data('AAPL', resolution, start_time, math.floor(end_time))
            else:
                if r['s'] == "no_data":
                    start_time -= 86400
                    end_time = start_time + 32400
                    r = get_symbol_data('AAPL', resolution, start_time, math.floor(end_time))
                else:
                    break
        return start_time, end_time, resolution, SECONDS_IN_MINUTE * 5

    else:
        start_time = (start_time[0], start_time[1], start_time[2], 8,
                      30, 00, start_time[6], start_time[7], start_time[8])
        start_time = math.floor(time.mktime(start_time))

        if period == "week":
            start_time -= 604800
            return start_time, current_time, "15", SECONDS_IN_MINUTE * 15

        if period == "month":
            start_time -= 2592000
            return start_time, current_time, "60", SECONDS_IN_HOUR

        if period == "3m":
            start_time -= 7776000
            return start_time, current_time, "D", SECONDS_IN_DAY

        if period == "y":
            start_time -= 31536000
            return start_time, current_time, "D", SECONDS_IN_DAY

        if period == "5y":
            start_time -= 157680000
            return start_time, current_time, "M", SECONDS_IN_DAY * 31

def get_symbol_data(symbol, resolution, start, end):
    r = requests.get(
        'https://finnhub.io/api/v1/stock/candle?symbol=' + symbol + '&resolution=' + resolution + '&from=' + str(start) + '&to=' + str(end) + '&token=' + FINNHUB_API_KEY)

    return r.json()

def user_current_worth(profile):
    worth = profile['portfolio_amount']
    holdings = Holdings.objects.filter(profile_id=profile['id']).values()

    for _, holding in enumerate(holdings):
        worth += get_quote(holding['symbol']) * holding['quantity']
    
    return worth

def get_quote(symbol):
    r = requests.get(
            'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY)
    r = r.json()

    return r['c']

def load_user_invites(id):
    invites_sent = Invites.objects.filter(sender_id=id).values()
    invites_receieved = Invites.objects.filter(receiver_id=id).values()
    invites = {}

    for _, value in enumerate(invites_sent):
        profile = Profile.objects.filter(id=value['receiver_id'])
        profile = profile[0]
        user = User.objects.filter(id=profile.user_id)
        user = user[0]
        
        invites[user.username] = {'time': value['time'], 'first_name': user.first_name, 'last_name': user.last_name, 'sent': True}

    for _, value in enumerate(invites_receieved):
        profile = Profile.objects.filter(id=value['sender_id'])
        profile = profile[0]
        user = User.objects.filter(id=profile.user_id)
        user = user[0]

        if value['game_id'] != None:
            game = Tournament.objects.filter(id=value['game_id'])
            game = game[0]
            game_info = {
                'start_amount': game.start_amount,
                'bet': game.bet
            }
            invites[game.room_code] = {'sender': user.username, 'game': game_info, 'sent': False}
        else:
            invites[user.username] = {'time': value['time'], 'first_name': user.first_name, 'last_name': user.last_name, 'sent': False}

    return invites

def load_user_friends(id):
    friends = Friends.objects.filter(Q(friend_id=id) | Q(user_id=id)).values()
    users_friends = {}

    for _, value in enumerate(friends):
        if value['user_id'] == id:
            friend_id = value['friend_id']
        else:
            friend_id = value['user_id']

        user = User.objects.filter(id=friend_id)
        user = user[0]

        users_friends[user.username] = {'time': value['time'], 'first_name': user.first_name, 'last_name': user.last_name}

    return users_friends

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
        "email": user.email,
        "cash": profile.cash,
        "holdings": get_holdings(profile)
    }

    if request != None:
        response['invites'] = load_user_invites(profile.id)
        response['friends'] = load_user_friends(user.id)

    return response

def set_cookie(key):
    age = 365 * 24 * 60 * 60
    expires = datetime.strftime(
        datetime.utcnow() + timedelta(seconds=age),
        "%a, %d-%b-%Y %H:%M:%S GMT",
    )
    headers = {
        "Set-Cookie": "OmegaToken=" + key + "; expires=" + expires + "; Path=/"
    }
    return headers

def transaction(request, bought, profile):
    symbol = request.data["symbol"]
    quantity = request.data["quantity"]
    quote = request.data["quote"]

    current_time = time.time()

    if request.data['dollars']:
        quantity = quantity
    else:
        quantity = quote['c'] * quantity

    if bought:
        cash = profile.cash - quantity
    else:
        cash = profile.cash + quantity

    if request.data['dollars']:
        quantity = quantity / quote['c']

    transaction = Transaction(bought=bought,
        time=round(current_time, 5),
        symbol=symbol,
        quantity=round(quantity, 10), 
        price=round(quote['c'], 4), 
        cash=round(cash, 4), 
        total_quantity=0, 
        profile=profile
    )

    return symbol, quantity, quote, transaction

def verify_user(verification_code):
    queryset = Profile.objects.filter(
        verification_code=verification_code)
    if queryset.exists():
        profile = queryset[0]
        profile.verification_code = 'auth'
        profile.save()
        user = User.objects.filter(id=profile.user_id)[0]
        token = Token.objects.create(user=user)
        token.save()
        headers = set_cookie(token.key)
        Response({"Success": "Email Verrified"}, headers=headers, status=status.HTTP_200_OK)
    else:
        return Response({'Error': 'Invalid Verification Code'}, status=status.HTTP_400_BAD_REQUEST)

def get_verification_code():
    choices = string.ascii_letters + string.digits
    while True:
        verification_code = ''.join(
            random.choice(choices) for i in range(6))
        queryset = Profile.objects.filter(verification_code=verification_code)
        if not queryset.exists():
            break
    return verification_code

def send_email(message, email):
    sender_email = "omegatradingtest@gmail.com"
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, email_password)
        server.sendmail(
            sender_email, email, message.as_string()
        )

def send_password_reset(user):
    verification_code = get_verification_code()
    email = user.email
    queryset = Profile.objects.filter(user_id=user.id)
    profile = queryset[0]
    # if profile.verification_code != "auth":
    # return Response({"Error": "User has not verified their email"}, status=status.HTTP_400_BAD_REQUEST)
    profile.verification_code = verification_code
    profile.save()

    message = MIMEMultipart("alternative")
    message["Subject"] = "Reset Omega Trading Password"
    sender_email = "omegatradingtest@gmail.com"
    message["From"] = sender_email
    message["To"] = email
    text = """\
                Hello """ + user.username + """,
                The link to reset your password is: http://127.0.0.1:8000/reset-password?verification_code=""" + verification_code + "" ""

    html = """\
                <html>
                <body>
                    <h1>Hello """ + user.username + """,</h1>
                    <br>
                    <h2> The link to reset your password is:
                    <br>
                    <h2></h2><a href=\"http://127.0.0.1:8000/reset-password?verification_code=""" + verification_code + """\"> <h2>Reset Password</h2></a>
                </body >
                </html >
                """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    send_email(message, email)
    return Response({"Success": "Email Sent"}, status=status.HTTP_200_OK)

def send_email_verification(email, username, verification_code):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Omega Trading Email Verification"
    sender_email = "omegatradingtest@gmail.com"
    message["From"] = sender_email
    message["To"] = email
    text = """\
                Hello """ + username + """,
                Your verification code is: """ + verification_code + "" ""

    html = """\
                <html>
                <body>
                    <h1>Hello """ + username + """,</h1>
                    <br>
                    <h2>Your Verification Code is: </h2> <a href=\"http://127.0.0.1:8000/verify-account?verification_code=""" + verification_code + """\"> <h2>"""+verification_code + """ </h2></a>
                </body >
                </html >
                """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    send_email(message, email)

def last_price(prices, count, offset = 1):
    price = None

    try:
        price = prices[count - offset]
        price = prices[count + offset]
    except IndexError:
        pass

    if price == None:
        return last_price(prices, count, offset + 1)
    else:
        return price

def normalize_symbol_data(data):
    charts = {}

    for symbol, values in data.items():
        charts[symbol] = [{'time': values['time'][i], 'price': values['price'][i]} for i in range(len(values['time']))]

    MAX = max(data, key=lambda symbol: len(data[symbol]['time']))
    count = 0
    for time in data[MAX]['time']:
        for symbol, values in data.items():
            if not time in values['time']:
                charts[symbol].append({'time': time, 'price': last_price(values['price'], count)})
        count += 1


    return charts

def portfolio_symbol_data(symbols, period):
    start_time, end_time, resolution, interval = determine_portfolio_period(period)

    small_charts = {}

    for symbol in symbols:
        data = get_symbol_data(symbol, resolution, 
            start_time, end_time)
        small_charts[symbol] = {'time': data['t'], 'price': data['c']}
    
    return normalize_symbol_data(small_charts)

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

def format_data_for_svg(numbers, width, height):
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

def no_transactions(period):
    start, end, _, interval = determine_portfolio_period(period)

    return [{'time': x, 'price': 25000} for x in range(start, end + 1, interval)], {}

def portfolio_data(profile, period):
    start_time, _, _, interval = determine_portfolio_period(period)
    transactions, symbols, cash, holdings = get_transactions(profile.id, start_time, period)

    if transactions == False:
        return no_transactions(period)

    MAX = max(symbols, key=lambda symbol: len(symbols[symbol]))
    numbers = []

    for value in symbols[MAX]:
        add = {"time": value['time']}

        for time, transaction in transactions.items():
            if time >= value['time'] and time < value['time'] + interval:
                if transaction['bought']:
                    if transaction['symbol'] in holdings:
                        holdings[transaction['symbol']] += float(transaction['quantity'])
                    else:
                        holdings[transaction['symbol']] = float(transaction['quantity'])
                else:
                    holdings[transaction['symbol']] -= float(transaction['quantity'])
            
                cash = transaction['cash']

        worth = float(cash)

        for symbol, quantity in holdings.items():
            for x in symbols[symbol]:
                if value['time'] >= x['time'] - (interval / 2) and value['time'] < x['time'] + (interval / 2):
                    worth += (quantity * x['price'])

        add['price'] = float(worth)

        numbers.append(add)
    
    return numbers, symbols

def get_transactions(id, start_time, period):
    Transactions = Transaction.objects.filter(profile_id=id).values()

    if len(Transactions) == 1:
        return False, [], 25000, {}

    transactions = {}
    symbols = []
    cash = None
    holdings = {}

    for _, transaction in enumerate(Transactions):
        if transaction['time'] >= start_time and transaction['symbol'] != '':
            transactions[transaction['time']] = transaction
        else:
            if transaction['symbol'] != '':
                if transaction['bought']:
                    if transaction['symbol'] in holdings:
                        holdings[transaction['symbol']] += float(transaction['quantity'])
                    else:
                        holdings[transaction['symbol']] = float(transaction['quantity'])                    
                else:
                    holdings[transaction['symbol']] -= float(transaction['quantity'])                    
            cash = transaction['cash'] 

        if (not transaction['symbol'] in symbols) and transaction['symbol'] != '':
            symbols.append(transaction['symbol'])

    if not cash:
        cash = 25000

    symbols = portfolio_symbol_data(symbols, period)

    return transactions, symbols, cash, holdings

def load_friend_portfolio(profile):
    numbers, _ = portfolio_data(profile, 'day')

    path, _ = format_data_for_svg(numbers, 64, 30)

    last_price = numbers[-1]['price']

    return path, last_price

def load_user_portfolio(profile, period):
    numbers, symbols = portfolio_data(profile, period)

    if period == "day":
        numbers = day_numbers(numbers)

    path, periods = format_data_for_svg(numbers, 676, 250)

    for symbol, value in symbols.items():
        last_price = value[-1]['price']
        symbol_path, _ = format_data_for_svg(value, 64, 30)
        symbols[symbol] = {
            'path': symbol_path,
            'last_price': last_price
        }

    return path, periods, symbols

def get_friends(id):
    friends = Friends.objects.filter(Q(friend_id=id) | Q(user_id=id)).values()
    friends_usernames = []

    for _, c in enumerate(friends):
        if c['user_id'] == id:
            user = User.objects.filter(id=c['friend_id'])
        else:
            user = User.objects.filter(id=c['user_id'])

        user = user[0]
        friends_usernames.append(user.username)

    return friends_usernames

def get_holdings(profile):
    holdings = Holdings.objects.filter(profile_id=profile.id).values()
    profile_holdings = {}

    for _, holding in enumerate(holdings):
        profile_holdings[holding['symbol']] = holding['quantity']

    return profile_holdings



