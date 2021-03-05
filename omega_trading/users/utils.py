from .TopSecret import email_password
import ssl
import smtplib
import string
import random
import datetime
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework import status
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .models import Profile
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


def authenticate_request(request):
    if request.user.is_authenticated:
        return True
    else:
        return False


def set_cookie(key):
    age = 365 * 24 * 60 * 60
    expires = datetime.datetime.strftime(
        datetime.datetime.utcnow() + datetime.timedelta(seconds=age),
        "%a, %d-%b-%Y %H:%M:%S GMT",
    )
    headers = {
        "Set-Cookie": "OmegaToken=" + key + "; expires=" + expires
    }
    return Response({"Success": "Email Verified"}, headers=headers, status=status.HTTP_200_OK)


def verify_user(verification_code):
    queryset = Profile.objects.filter(
        verification_code=verification_code)
    if queryset.exists():
        print("it exists")
        profile = queryset[0]
        profile.verification_code[0:3] = 'auth'
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
    if profile.verification_code != "auth":
        return Response({"Error": "User has not verified their email"}, status=status.HTTP_400_BAD_REQUEST)
    profile.verification_code = "auth" + verification_code
    profile.save()

    message = MIMEMultipart("alternative")
    message["Subject"] = "Reset Omega Trading Password"
    sender_email = "omegatradingtest@gmail.com"
    message["From"] = sender_email
    message["To"] = email
    text = """\
                Hello """ + user.username + """,
                The link to reset your password is: http://127.0.0.1:8000/users/reset-password?verification_code=""" + verification_code + "" ""

    html = """\
                <html>
                <body>
                    <h1>Hello """ + user.username + """,</h1>
                    <br>
                    <h2> The link to reset your password is:
                    <br>
                    <h2></h2><a href=\"http://127.0.0.1:8000/users/reset-password?verification_code=\"""" + verification_code + """\", username=\"""" + user.username + """"\"> <h2>Reset Password</h2></a>
                </body >
                </html >
                """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    send_email(message, email)


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
                    <h2>Your Verification Code is: </h2> <a href=\"http://127.0.0.1:8000/users/verify-email-link?verification_code=""" + verification_code + """\"> <h2>"""+verification_code + """ </h2></a>
                </body >
                </html >
                """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)
    send_email(message, email)
