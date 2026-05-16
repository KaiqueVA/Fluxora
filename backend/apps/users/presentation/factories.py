from apps.users.application.services import LoginUserService, RegisterUserService
from apps.users.infrastructure.repositories import UserRepository


def register_user_service():
    return RegisterUserService(UserRepository())


def login_user_service():
    return LoginUserService()
