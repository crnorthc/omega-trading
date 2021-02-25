from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    portfolio_amount = models.FloatField(default=25000)


class Friends(models.Model):
    user = models.ManyToManyField(User, related_name='user')
    friend = models.ManyToManyField(User, related_name='friend')
