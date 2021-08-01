from django.contrib.auth.models import User
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey



class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cash = models.FloatField(default=25000)
    verification_code = models.CharField(max_length=6)
    latest_path = models.CharField(max_length=25, default='/')
    address = models.CharField(max_length=40, default='')

class Transaction(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    bought = models.BooleanField()
    symbol = models.CharField(max_length=10)
    quantity = models.DecimalField(max_digits=25, decimal_places=10)
    price = models.DecimalField(max_digits=10, decimal_places=3)
    time = models.DecimalField(max_digits=15, decimal_places=5)
    cash = models.DecimalField(max_digits=25, decimal_places=4)
    total_quantity = models.DecimalField(max_digits=25, decimal_places=10)

class Holdings(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.DecimalField(max_digits=25, decimal_places=10)

class Friends(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend')
    time = models.DecimalField(max_digits=15, decimal_places=5)

class Invites(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='recipient')
    game = models.ForeignKey('game.Tournament', on_delete=models.CASCADE, blank=True, null=True)
    time = models.DecimalField(max_digits=15, decimal_places=5)
