from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings

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