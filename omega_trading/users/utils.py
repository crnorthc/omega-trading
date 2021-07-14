from .TopSecret import *
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework import status
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .models import Profile
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import ssl
import smtplib
import datetime
import time
import math
import random
import string
import requests

SECONDS_IN_DAY = 24 * 60 * 60
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MINUTE = 60

def determine_portfolio_period(period):
    current_time = math.floor(time.time())
    interval = None
    start_time = time.localtime()

    if period == "day":
        start_time = (start_time[0], start_time[1], start_time[2], 9,
                      00, 00, start_time[6], start_time[7], start_time[8])
        start_time = math.floor(time.mktime(start_time))

        resolution = "5"
        interval = 300
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
        return start_time, current_time, resolution, interval

    else:
        start_time = (start_time[0], start_time[1], start_time[2], 9,
                      30, 00, start_time[6], start_time[7], start_time[8])
        start_time = math.floor(time.mktime(start_time))

        if period == "week":
            start_time -= 604800
            return start_time, current_time, "15", 900

        if period == "month":
            start_time -= 2592000
            return start_time, current_time, "60", 3600

        if period == "3m":
            start_time -= 7776000
            return start_time, current_time, "D", 86400

        if period == "y":
            start_time -= 31536000
            return start_time, current_time, "D", 86400

        if period == "5y":
            start_time -= 157680000
            return start_time, current_time, "M", 1209600

def no_transactions(profile, period):
    start_time, current_time, resolution, interval = determine_portfolio_period(period)
    numbers = []
    count = 0
    current_time = time.time()

    while (start_time + (interval * count) <= current_time):
        add = {'time': start_time + (interval * count)}
        add['price'] = 25000
        numbers.append(add)
        count += 1

    return numbers, []

def get_symbol_data(symbol, resolution, start, end):
    r = requests.get(
        'https://finnhub.io/api/v1/stock/candle?symbol=' + symbol + '&resolution=' + resolution + '&from=' + start + '&to=' + end + '&token=' + FINNHUB_API_KEY)

    return r.json()

def format_symbol_data(data):
    return [{'time': data['t'][i], 'price': data['c'][i]} for i in range(len(data['c']))]

def get_small_charts(profile):
    start_time, current_time, resolution, interval = determine_portfolio_period('day')
    small_charts = {}

    for symbol, amount in profile.holdings.items():
        data = get_symbol_data(symbol, '5', str(
            start_time), str(current_time))
        small_charts[symbol] = format_symbol_data(data)
    
    return small_charts

def get_user_symbols(profile, period):
    start_time, current_time, resolution, interval = determine_portfolio_period(period)
    charts = {}
    times = []

    for day, transactions in profile.transactions.items():
        for transaction in transactions:
            if 'symbol' in transaction:
                symbol = transaction['symbol']
                if not symbol in charts:
                    data = get_symbol_data(symbol, resolution, str(start_time), str(current_time))
                    charts[symbol] = data['c']
                    times.append(data['t'])
    
    times = max(times, key=len)

    for symbol, data in charts.items():
        if len(data) < len(times) - 1:
            data.extend([data[-1] for x in range(len(times) - len(data))])

    return charts, times

def initial_profile(profile, first_day, days):
    latest_amount = 0
    latest_day = 0
    latest_holdings = {}

    if first_day < days[0]:
        latest_day = profile.transactions[str(
            math.floor(days[0]))]
    else:
        for day in days:
            if first_day > day:
                latest_day = profile.transactions[str(
                    math.floor(day))]
                for s in latest_day:
                    if 'symbol' in s:
                        if s['symbol'] in latest_holdings:
                            if s['bought']:
                                latest_holdings[s['symbol']] += s['quantity']
                            else:
                                latest_holdings[s['symbol']] -= s['quantity']
                        else:
                            latest_holdings[s['symbol']] = s['total_quantity']
                    latest_amount = s['portfolio_amount']
                latest_transaction = latest_day[-1]
    if latest_amount == 0:
        latest_amount = 25000
    
    return latest_amount, latest_holdings

def user_current_worth(profile):
    worth = profile['portfolio_amount']
    for symbol, quantity in profile['holdings'].items():
        worth += get_quote(symbol) * quantity
    
    return worth

def get_quote(symbol):
    r = requests.get(
            'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=' + FINNHUB_API_KEY)
    r = r.json()

    return r['c']

def compute_transactions(latest_day, latest_holdings, times, prev_time, i, latest_amount):
    for x in latest_day:
        if float(x['time']) <= float(times[i]) and float(x['time']) > float(prev_time):
            if x['symbol'] in latest_holdings:
                if x['bought']:
                    latest_holdings[x['symbol']
                                    ] += x['quantity']
                else:
                    latest_holdings[x['symbol']
                                    ] -= x['quantity']
            else:
                latest_holdings[x['symbol']] = x['quantity']

            latest_amount = x['portfolio_amount']
    
    return latest_holdings, latest_amount

def no_recent_transactions(profile, charts, days):
    current_holdings = []

    for symbol, prices in charts.items():
        for price in prices:
            if symbol in profile.holdings:
                current_holdings.append(
                    {'price': price, 'total_quantity': profile.holdings[symbol]})

    return current_holdings, profile.transactions[str(
        math.floor(days[-1]))][-1]['portfolio_amount']

def get_recent_quotes(profile, portfolio_amount):
    temp = {"time": time.time(), 'portfolio_amount': portfolio_amount,
            'securities': []}

    for symbol, value in profile.holdings.items():
        quote = get_quote(symbol)
        temp['securities'].append(
            {'price': quote, 'total_quantity': value})
    
    return temp

def format_portfolio_data(goal, recent_found, current_holdings, portfolio_amount):
    numbers = []
    count = 0

    for x in goal:
        if not recent_found:
            x['securities'] = [current_holdings[count]]
            x['portfolio_amount'] = portfolio_amount
        add = {'time': x['time']}
        price = 0
        for y in x['securities']:
            price = price + (y['price'] * y['total_quantity'])
        price += x['portfolio_amount']
        add['price'] = price
        numbers.append(add)
        count += 1
    
    return numbers

def load_portfolio(period, user, me=False):
    profile = Profile.objects.filter(user_id=user.id)
    profile = profile[0]

    if len(profile.transactions) == 1:
        return no_transactions(profile, period)

    charts, times = get_user_symbols(profile, period)
    first_day = time.localtime(times[0])
    first_day = (first_day[0], first_day[1], first_day[2], 1,
                 00, 00, first_day[6], first_day[7], first_day[8])
    first_day = math.floor(time.mktime(first_day))
    days = [float(key) for key, value in profile.transactions.items()]
    days.sort()
    latest_amount, latest_holdings = initial_profile(profile, first_day, days)
    prev_time = times[0]
    recent_found = False
    goal = []

    for i in range(len(times)):
        day = time.localtime(times[i])
        day = (day[0], day[1], day[2], 1,
               00, 00, day[6], day[7], day[8])
        day = math.floor(time.mktime(day))
        add = {"time": times[i], 'securities': []}

        # if the time period is before transactions
        if (day <= days[0]):
            add['portfolio_amount'] = latest_amount
            recent_found = True
        # if the time period is after transactions
        else:
            # if there were transactions in the current periods day
            if str(day) in profile.transactions:
                recent_found = True
                latest_day = profile.transactions[str(day)]
                latest_holdings, latest_amount = compute_transactions(
                    latest_day, latest_holdings, times, prev_time, i, latest_amount)
                add['portfolio_amount'] = latest_amount
            # if there were not any transactions during the current periods day
            else:
                add['portfolio_amount'] = latest_amount
            for symbol, quantity in latest_holdings.items():
                if symbol in charts:
                    add['securities'].append(
                        {'symbol': symbol, 'total_quantity': quantity, 'price': charts[symbol][i]})

        prev_time = times[i]
        goal.append(add)

    if not recent_found:
        latest_holdings, latest_amount = no_recent_transactions(profile, charts, days)

    if period == "3m" or period == "y" or period == "5y":
        goal.append(get_recent_quotes(profile, goal[-1]['portfolio_amount']))

    return format_portfolio_data(goal, recent_found, latest_holdings, latest_amount), get_small_charts(profile)

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
    if request != None:
        response['invites'] = profile.invites
        response['friends'] = profile.friends
    return response

def set_cookie(key):
    age = 365 * 24 * 60 * 60
    expires = datetime.datetime.strftime(
        datetime.datetime.utcnow() + datetime.timedelta(seconds=age),
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
    start_time = time.localtime()
    start_time = (start_time[0], start_time[1], start_time[2], 1,
                  00, 00, start_time[6], start_time[7], start_time[8])
    start_time = math.floor(time.mktime(start_time))

    if request.data['dollars']:
        quantity = quantity
    else:
        quantity = quote['c'] * quantity

    if bought:
        portfolio_amount = profile.portfolio_amount - quantity
    else:
        portfolio_amount = profile.portfolio_amount + quantity

    if request.data['dollars']:
        quantity = quantity / quote['c']

    add = {"bought": bought, "symbol": symbol, "quantity": quantity,
           "price": quote['c'], "time": current_time, "portfolio_amount": portfolio_amount}

    return symbol, quantity, quote, add, start_time

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
        return set_cookie(token.key)
    else:
        return Response({'Error': 'Invalid Verification Code'}, status=status.HTTP_400_BAD_REQUEST)

def get_user_details(user):
    queryset = Profile.objects.filter(user_id=user.id)
    profile = queryset[0]
    user_info = {
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "portfolio_amount": profile.portfolio_amount
    }
    return user_info

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
