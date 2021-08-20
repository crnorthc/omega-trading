from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .player_utils import *
from .models import *


class PlayGame(APIView):

    def post(self, request, format=None):
        code = request.data['room_code']
        game = Game.objects.filter(room_code=code)
        game= game[0]

        info = player_info(game, request.user)

        return Response({'player': info}, status=status.HTTP_200_OK)