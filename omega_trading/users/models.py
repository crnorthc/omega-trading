from decimal import Decimal
from django.contrib.auth.models import User
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey


class Friends(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend')
    time = models.DecimalField(max_digits=15, decimal_places=5)

class Invites(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipient')
    game = models.ForeignKey('game.Game', on_delete=models.CASCADE, blank=True, null=True)
    time = models.DecimalField(max_digits=15, decimal_places=5)

class IDToken(models.Model):
    user = user = models.ForeignKey(User, on_delete=models.CASCADE)
    key = models.CharField(max_length=40, primary_key=True)

class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    coin = models.CharField(max_length=5)
    nonce = models.IntegerField(default=0, null=True)

class Address(models.Model):
    address = models.CharField(max_length=100, primary_key=True)
    amount = models.DecimalField(default=0, max_digits=28, decimal_places=18)

class Frozen(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    amount = models.DecimalField(default=0, max_digits=28, decimal_places=18)
    code = models.CharField(max_length=8)