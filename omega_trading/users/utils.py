from rest_framework.response import Response
from rest_framework import status


def authenticate_request(request):
    if request.user.is_authenticated:
        return True
    else:
        return False
