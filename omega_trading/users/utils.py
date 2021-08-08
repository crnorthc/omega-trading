from .TopSecret import *
from rest_framework.response import Response
from rest_framework import status
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .models import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models import Q
from django.apps import apps
from datetime import datetime, timedelta
import ssl
import smtplib
import binascii
import os


SECONDS_IN_DAY = 24 * 60 * 60
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MINUTE = 60

Tournament = apps.get_model('game', 'Game')

def generate_token():
    token = binascii.hexlify(os.urandom(20)).decode()
    tokens = IDToken.objects.filter(key=token)

    while tokens.exists():
        token = binascii.hexlify(os.urandom(20)).decode()
        tokens = IDToken.objects.filter(key=token)

    return token

def load_user_invites(id):
    invites_sent = Invites.objects.filter(sender_id=id).values()
    invites_receieved = Invites.objects.filter(receiver_id=id).values()
    invites = {}



    for _, value in enumerate(invites_sent):
        receiever = User.objects.filter(id=value['id'])
        receiever = receiever[0]
        
        invites[receiever.username] = {'time': value['time'], 'first_name': receiever.first_name, 'last_name': receiever.last_name, 'sent': True}

    for _, value in enumerate(invites_receieved):
        sender = User.objects.filter(id=value['id'])
        sender = sender[0]

        if value['game_id'] != None:
            game = Tournament.objects.filter(id=value['game_id'])
            game = game[0]
            game_info = {
                'start_amount': game.start_amount,
                'bet': game.bet
            }
            invites[game.room_code] = {'sender': sender.username, 'game': game_info, 'sent': False}
        else:
            invites[sender.username] = {'time': value['time'], 'first_name': sender.first_name, 'last_name': sender.last_name, 'sent': False}

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

def load_user(user=None, request=None, username=None):
    if username != None:
        queryList = User.objects.filter(username=username)
        user = queryList[0]
    if request != None:
        user = request.user

    response = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }

    if request != None:
        response['invites'] = load_user_invites(user.id)
        response['friends'] = load_user_friends(user.id)

    return response

def set_cookie(key, name, now=False):
    if now:
        expires = datetime.strftime(
            datetime.utcnow(),
            "%a, %d-%b-%Y %H:%M:%S GMT",
        )
    else:
        age = 365 * 24 * 60 * 60
        expires = datetime.strftime(
            datetime.utcnow() + timedelta(seconds=age),
            "%a, %d-%b-%Y %H:%M:%S GMT",
        )

    return {
        "Set-Cookie": "{name}={key}; expires={expires}; Path=/".format(name=name, key=key, expires=expires)
    }

def verify_user(id):
    user = User.objects.filter(id=id)
    user = user[0]
    token = Token.objects.create(user=user)
    token.save()
    headers = set_cookie(token.key, 'loggedIn')
    return Response({"Success": "Email Verrified"}, headers=headers, status=status.HTTP_200_OK)

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

def send_email_verification(email, username, key):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Omega Trading Email Verification"
    sender_email = "omegatradingtest@gmail.com"
    message["From"] = sender_email
    message["To"] = email
    text = """\
                Hello """ + username + ""","""

    html = """\
                <html>
                <body>
                    <h1>Hello """ + username + """,</h1>
                    <br>
                   <a href=\"http://127.0.0.1:8000/verify-account?verification_code=""" + key + """\">Verify Email</a>
                </body >
                </html >
                """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    send_email(message, email)

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

def login(user):
    token = Token.objects.filter(user_id=user.id)
    headers = set_cookie(token[0].key, 'loggedIn')

    return Response({"Success": load_user(user=user)}, headers=headers, status=status.HTTP_200_OK)

def logout(user):
    token = Token.objects.filter(user_id=user.id)
    headers = set_cookie(token[0].key, 'loggedIn', True)

    return Response({"Success": "User Logged Out"}, headers=headers, status=status.HTTP_200_OK)