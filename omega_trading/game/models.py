from django.contrib.auth.models import User
from django.db import models
from django.db.models.deletion import SET_NULL
from django.db.models.fields.related import ForeignKey
from datetime import datetime as dt

def format_time(time):
    time = dt.fromtimestamp(time)
    
    return {
        'year': time.year,
        'month': time.month,
        'day': time.day,
        'hours': time.hour,
        'minutes': time.minute
    }


class Ebet(models.Model):
    bet = models.DecimalField(max_digits=25, decimal_places=10)
    crypto = models.CharField(max_length=10)
    payout = models.IntegerField(default=0)


class Competition(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=8)
    bet = models.ForeignKey(Ebet, on_delete=models.CASCADE, null=True)
    size = models.IntegerField(default=0)
    active = models.BooleanField(default=False)


class Tournament(Competition):
    round = models.CharField(max_length=4, default='day')
    commission = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    options = models.BooleanField(default=True) 

    def get_info(self):
        return {
            'type': 'tournament',
            'active': self.active,
            'size': self.size,
            'code': self.code,
            'name': self.name,
            'commission': self.commission,
            'options': self.options,
            'round': self.round
        } 


class Game(Competition):
    start_amount = models.FloatField(default=10000)
    start_time = models.IntegerField(default=0)
    end_time = models.IntegerField(default=0)    
    public = models.BooleanField(default=True)  


class ShortGame(Game):
    duration = models.IntegerField(default=0)

    def get_info(self):
        return {
            'type': 'short',
            'duration': self.duration,
            'public': self.public,
            'start_amount': self.start_amount,
            'active': self.active,
            'size': self.size,
            'code': self.code,
            'name': self.name,
        }


class LongGame(Game):
    commission = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    options = models.BooleanField(default=True) 

    def get_info(self):
        return {
            'type': 'long',
            'start_time': format_time(self.start_time),
            'end_time': format_time(self.end_time),
            'public': self.public,
            'start_amount': self.start_amount,
            'active': self.active,
            'size': self.size,
            'code': self.code,
            'name': self.name,
            'commission': self.commission,
            'options': self.options,
        } 


class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Competition, on_delete=models.CASCADE)
    is_host = models.BooleanField(default=False)
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