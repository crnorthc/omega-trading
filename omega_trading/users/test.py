from TopSecret import email_password
import ssl
import smtplib
from rest_framework.response import Response
from rest_framework import status
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email_verification(email, username, verification_code):
    message = MIMEMultipart("alternative")
    sender_email = "omegatradingtest@gmail.com"
    message["Subject"] = "Verification Code"
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
                    <h2>Your Verification Code is: </h2> <a href=\"http://127.0.0.1:8000/users/verify-email?verification_code=""" + verification_code + """\"> <h2>"""+verification_code + """ </h2></a>
                </body >
                </html >
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


send_email_verification('crnorthc@eckerd.edu', 'crnorthc', 'KJGHKJ')
