from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.db import models


class Friends(models.Model):
    user = models.ManyToManyField(User, related_name='user')
    friend = models.ManyToManyField(User, related_name='friend')


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    portfolio_amount = models.FloatField(default=25000)
    verification_code = models.CharField(max_length=6)
    transactions = models.JSONField(default=dict)
    holdings = models.JSONField(default=dict)
