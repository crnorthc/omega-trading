from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Friends


class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username',
                  'email', 'portfolio_amount')


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'password', 'email')


class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username')


class FriendSerializer(serializers.Serializer):
    class Meta:
        model = Friends
        fields = ('username', 'friends')
