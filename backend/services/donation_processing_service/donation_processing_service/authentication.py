from typing import Optional

from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication, AuthUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings
from rest_framework_simplejwt.tokens import Token


class JWTAuthenticationService(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]

            class MicroserviceUser:
                def __init__(self, user_id):
                    self.id = user_id
                    self.is_authenticated = True
                    self.is_anonymous = False
                    self.pk = user_id

                def __str__(self):
                    return f"MicroserviceUser({self.id})"

                def __repr__(self):
                    return self.__str__()

            return MicroserviceUser(user_id)
        except KeyError:
            raise InvalidToken('Token does not contain the user ID claim.')
        except Exception as e:
            raise InvalidToken(f'Token is invalid: {str(e)}')

    def authenticate(self, request: Request):
            """Override to add user_id to request"""
            header = self.get_header(request)
            if header is None:
                return None

            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None

            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)

            # Add user_id to request
            request.user_id = user.id

            return (user, validated_token)