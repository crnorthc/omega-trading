from django.contrib.auth.models import User
from django.db import models


class Tournament(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    start_amount = models.FloatField(default=10000)
    room_code = models.CharField(max_length=8)
    players = models.JSONField(default=dict)
    start_time = models.CharField(max_length=10)
    end_time = models.CharField(max_length=10)
    invites = models.JSONField(default=dict)
    bet = models.FloatField(default=10000)
    positions = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    duration = models.JSONField(default=dict)
