from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.domain.entities import UserEntity
from apps.users.domain.exceptions import (
    AuthenticationException,
    UserAlreadyExistsException,
    ValidationException,
)
from apps.users.domain.interfaces import UserRepositoryInterface
from apps.users.domain.validators import PasswordValidator


class RegisterUserService:

    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(self, email: str, password: str, name: str):
        user_entity = UserEntity(email=email, password=password)

        if not user_entity.is_valid_email():
            raise ValidationException("Invalid email.")

        PasswordValidator.validate(password)

        if self.repository.get_by_email(email):
            raise UserAlreadyExistsException("Email already exists.")

        return self.repository.create(email=email, password=password, name=name)


class LoginUserService:

    def execute(self, email: str, password: str):
        user = authenticate(username=email, password=password)

        if not user:
            raise AuthenticationException("Invalid credentials.")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user_id": user.id,
        }
