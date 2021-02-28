from .secrets import email_password
import ssl
import smtplib
from rest_framework.response import Response
from rest_framework import status
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def authenticate_request(request):
    if request.user.is_authenticated:
        return True
    else:
        return False


def send_email_verification(email, username, verification_code):
    message = MIMEMultipart("alternative")
    sender_email = "omegatradingtest@gmail.com"
    message["Subject"] = "multipart test"
    message["From"] = sender_email
    message["To"] = email
    text = """\
            Hello {username},
            Your verification code is: {verification_code}"""

    html = """\
            <html>
            <body>
                <h1>Hello {username},</h1>
                <br>
                <br>
                <h2>Your Verification Code is: <strong>{verification_code}</strong></h2>
            </body>
            </html>
            """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, email_password)
        server.sendmail(
            sender_email, email, message.as_string()
        )
