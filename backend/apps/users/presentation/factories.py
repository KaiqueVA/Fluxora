from apps.users.application.services import (
    LoginUserService,
    RegisterUserService,
    UpdateUserMonthlyIncomeService,
    UpdateUserPhoneService,
    UpdateUserProfessionService,
)
from apps.users.infrastructure.repositories import UserRepository


def register_user_service():
    return RegisterUserService(UserRepository())


def login_user_service():
    return LoginUserService()


def update_user_phone_service():
    return UpdateUserPhoneService(UserRepository())


def update_user_profession_service():
    return UpdateUserProfessionService(UserRepository())


def update_user_monthly_income_service():
    return UpdateUserMonthlyIncomeService(UserRepository())
