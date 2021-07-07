from django.contrib.auth.models import User
from django.apps import apps
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament
import random
import string

Profile = apps.get_model('users', 'Profile')


def load_user(request=None, username=None):
    if request == None:
        queryList = User.objects.filter(username=username)
        user = queryList[0]
    else:
        user = request.user
    username = user.username
    first_name = user.first_name
    last_name = user.last_name
    email = user.email
    profile = Profile.objects.filter(user_id=user.id)
    profile = profile[0]
    portfolio_amount = profile.portfolio_amount
    securities = profile.holdings
    response = {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "portfolio_amount": portfolio_amount,
        "holdings": securities
    }
    response['invites'] = profile.invites
    response['friends'] = profile.friends
    return response


def get_game(room_code):
    game = Tournament.objects.filter(room_code=room_code)
    if game.exists():
        game = game[0]
        return game
    return Response({"Error": "No Room Found"}, status=status.HTTP_404_NOT_FOUND)


def uninvite(profile, username, room_code):
    game = Tournament.objects.filter(room_code=room_code)
    game = game[0]
    if username in game.invites:
        del game.invites[username]
    if room_code in profile.invites:
        del profile.invites[room_code]
    return game, profile


def get_room_code():
    choices = string.ascii_uppercase + string.digits
    choices = choices.replace('l', '')
    choices = choices.replace('I', '')
    while True:
        room_code = ''.join(
            random.choice(choices) for i in range(8))
        queryset = Tournament.objects.filter(
            room_code=room_code)
        if not queryset.exists():
            break
    return room_code


def get_game_info(game):
    user = User.objects.filter(username=game.host.username)
    user = user[0]
    return {
        'host': {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        },
        'start_amount': game.start_amount,
        'bet': game.bet,
        'room_code': game.room_code,
        'positions': game.positions,
        'players': game.players,
        'invites': game.invites
    }
