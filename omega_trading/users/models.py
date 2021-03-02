from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    portfolio_amount = models.FloatField(default=25000)
    verification_code = models.CharField(max_length=6)


class Friends(models.Model):
    user = models.ManyToManyField(User, related_name='user')
    friend = models.ManyToManyField(User, related_name='friend')
