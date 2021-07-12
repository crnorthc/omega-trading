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


def authenticate_request(request):
    if request.user.is_authenticated:
        return True
    else:
        return False


def load_portfolio(period, user, me=False):
    current_time = time.time()
    interval = None
    start_time = time.localtime()

    profile = Profile.objects.filter(user_id=user.id)
    profile = profile[0]

    # Part 1 Determining the period
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

    else:
        start_time = (start_time[0], start_time[1], start_time[2], 9,
                      30, 00, start_time[6], start_time[7], start_time[8])
        start_time = math.floor(time.mktime(start_time))

        if period == "week":
            start_time -= 604800
            resolution = "15"
            interval = 900
        if period == "month":
            start_time -= 2592000
            resolution = "60"
            interval = 3600
        if period == "3m":
            start_time -= 7776000
            resolution = "D"
            interval = 86400
        if period == "y":
            start_time -= 31536000
            resolution = "D"
            interval = 86400
        if period == "5y":
            start_time -= 157680000
            resolution = "W"
            interval = 1209600

    # Part 2: determines if there have been no transactions
    if len(profile.transactions) == 1:
        numbers = []
        count = 0
        current_time = time.time()
        while (start_time + (interval * count) <= current_time):
            add = {'time': start_time + (interval * count)}
            add['price'] = 25000
            numbers.append(add)
            count += 1
        return numbers, []

    current_time = str(math.floor(current_time))
    start_time = str(start_time)

    # Part 3: Generate the lists of prices for each symbol owned
    temp = {}
    times = []
    small_charts = {}
    print(start_time)
    print(current_time)
    # Generates the list of prices for each symbol
    for key, value in profile.transactions.items():
        for t in value:
            if 'symbol' in t:
                s = t['symbol']
                if not s in temp:
                    r = requests.get(
                        'https://finnhub.io/api/v1/stock/candle?symbol=' + s + '&resolution=' + resolution + '&from=' + start_time + '&to=' + current_time + '&token=' + FINNHUB_API_KEY)
                    r = r.json()
                    temp[s] = r['c']
                    times.append(r['t'])
                    if s in profile.holdings:
                        small_charts[s] = []
                        for i in range(len(r['t']) - 1):
                            small_charts[s].append(
                                {'time': r['t'][i], 'price': r['c'][i]})
    times = min(times, key=len)

    # transforms each list of symbol prices to uniform length
    for key, value in temp.items():
        temp[key] = temp[key][(-1) * len(times):]

    # Find the first day of the selected period
    first_day = time.localtime(times[0])
    first_day = (first_day[0], first_day[1], first_day[2], 1,
                 00, 00, first_day[6], first_day[7], first_day[8])
    first_day = math.floor(time.mktime(first_day))
    prev_time = times[0]
    latest_day = 0
    days = []
    latest_holdings = {}
    # Part 4: Get the list of days in ascending order
    for key, value in profile.transactions.items():
        days.append(float(key))
    days.sort()

    # Part 5: Get the account holdings, portfolio amount, latest_day, and latest transaction at the begining day of period
    latest_amount = 0
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

    goal = []
    recent_found = False
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
                for x in latest_day:
                    # if there were transactions during the time period
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
                        # adjust portfolio amount to before transactions
                        transaction = x['price'] * x['quantity']
                        if x['bought']:
                            latest_amount = x['portfolio_amount']
                        else:
                            latest_amount = x['portfolio_amount']
                add['portfolio_amount'] = latest_amount
            # if there were not any transactions during the current periods day
            else:
                add['portfolio_amount'] = latest_amount
            for key, value in latest_holdings.items():
                if key in temp:
                    add['securities'].append(
                        {'symbol': key, 'total_quantity': value, 'price': temp[key][i]})

        prev_time = times[i]
        goal.append(add)

    numbers = []
    current_sec = []
    if not recent_found:
        for key, values in temp.items():
            for value in values:
                if key in profile.holdings:
                    current_sec.append(
                        {'price': value, 'total_quantity': profile.holdings[key]})
    portfolio_amount = profile.transactions[str(
        math.floor(days[-1]))][-1]['portfolio_amount']

    temp = {"time": time.time(), 'portfolio_amount': portfolio_amount,
            'securities': []}
    if period == "3m" or period == "y" or period == "5y":
        for key, value in profile.holdings.items():
            r = requests.get(
                'https://finnhub.io/api/v1/quote?symbol=' + key + '&token=' + FINNHUB_API_KEY)
            r = r.json()
            temp['securities'].append(
                {'price': r['c'], 'total_quantity': value})
        goal.append(temp)

    count = 0
    for x in goal:
        if not recent_found:
            x['securities'] = [current_sec[count]]
            x['portfolio_amount'] = portfolio_amount
        add = {'time': x['time']}
        price = 0
        for y in x['securities']:
            price = price + (y['price'] * y['total_quantity'])
        price += x['portfolio_amount']
        add['price'] = price
        numbers.append(add)
        count += 1
    return numbers, small_charts


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
