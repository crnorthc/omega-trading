from django.contrib.auth.models import User
from django.db import models
from django.db.models.deletion import SET_NULL
from django.db.models.fields.related import ForeignKey

class Duration(models.Model):
    days = models.IntegerField(default=0)
    hours = models.IntegerField(default=0)
    minutes = models.IntegerField(default=0)


class Game(models.Model):
    name = models.CharField(max_length=20)
    start_amount = models.FloatField(default=10000)
    room_code = models.CharField(max_length=8)
    start_time = models.IntegerField(default=0)
    end_time = models.IntegerField(default=0)
    commission = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    active = models.BooleanField(default=False)
    e_bet = models.BooleanField(default=False)
    public = models.BooleanField(default=True)
    options = models.BooleanField(default=True)
    duration = models.ForeignKey(Duration, on_delete=models.SET_NULL, null=True)


class Ebet(models.Model):
    bet = models.DecimalField(max_digits=25, decimal_places=10)
    crypto = models.CharField(max_length=10)
    game = ForeignKey(Game, on_delete=models.CASCADE)


class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    address = models.CharField(max_length=42, default='')
    key = models.CharField(max_length=64, default ='')
    is_host = models.BooleanField(default=False)
    payed = models.BooleanField(default=False)
    ready = models.BooleanField(default=False)
    cash = models.DecimalField(max_digits=25, decimal_places=4, null=True)


class Transactions(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    bought = models.BooleanField()
    symbol = models.CharField(max_length=10)
    quantity = models.DecimalField(max_digits=25, decimal_places=10)
    price = models.DecimalField(max_digits=10, decimal_places=3)
    time = models.DecimalField(max_digits=15, decimal_places=5)
    cash = models.DecimalField(max_digits=25, decimal_places=4)
    total_quantity = models.DecimalField(max_digits=25, decimal_places=10)
    positions = models.IntegerField(default=0)


class Holdings(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.DecimalField(max_digits=25, decimal_places=10)


class History(models.Model):
    start_amount = models.FloatField(default=10000)
    bet = models.FloatField(default=10000)
    start_time = models.CharField(max_length=10)
    duration: models.JSONField(default=dict)
    positions = models.IntegerField(default=0)


class PlayerHistory(models.Model):
    history = models.ForeignKey(History, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cash = models.DecimalField(max_digits=25, decimal_places=4)