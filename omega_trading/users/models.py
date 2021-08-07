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