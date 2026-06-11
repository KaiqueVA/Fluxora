from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.domain.entities import UserEntity
from apps.users.domain.exceptions import (
    AuthenticationException,
    UserAlreadyExistsException,
    ValidationException,
)
from apps.users.domain.interfaces import UserRepositoryInterface
from apps.users.domain.validators import PasswordValidator, UserProfileValidator


class RegisterUserService:

    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(
        self,
        email: str,
        password: str,
        name: str,
        birth_date=None,
        phone: str | None = None,
        profession: str | None = None,
        monthly_income=None,
    ):
        user_entity = UserEntity(
            email=email,
            password=password,
            name=name,
            birth_date=birth_date,
            phone=phone,
            profession=profession,
            monthly_income=monthly_income,
        )

        if not user_entity.is_valid_email():
            raise ValidationException("Invalid email.")

        PasswordValidator.validate(password)
        UserProfileValidator.validate_name(name)
        if birth_date:
            UserProfileValidator.validate_birth_date(birth_date)
        if phone:
            UserProfileValidator.validate_phone(phone)
        UserProfileValidator.validate_profession(profession)
        UserProfileValidator.validate_monthly_income(monthly_income)

        if self.repository.get_by_email(email):
            raise UserAlreadyExistsException("Email already exists.")

        return self.repository.create(
            email=email,
            password=password,
            name=name,
            birth_date=birth_date,
            phone=phone,
            profession=profession,
            monthly_income=monthly_income,
        )


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
            "name": user.name,
            "email": user.email,
            "birth_date": user.birth_date,
            "phone": user.phone,
            "profession": user.profession,
            "monthly_income": user.monthly_income,
        }


class UpdateUserPhoneService:

    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(self, user, phone: str):
        UserProfileValidator.validate_phone(phone)
        return self.repository.update(user, phone=phone)


class UpdateUserProfessionService:

    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(self, user, profession: str | None):
        UserProfileValidator.validate_profession(profession)
        return self.repository.update(user, profession=profession or None)


class UpdateUserMonthlyIncomeService:

    def __init__(self, repository: UserRepositoryInterface):
        self.repository = repository

    def execute(self, user, monthly_income):
        UserProfileValidator.validate_monthly_income(monthly_income)
        return self.repository.update(user, monthly_income=monthly_income)
