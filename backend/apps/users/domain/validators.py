import re

from apps.users.domain.exceptions import ValidationException


class PasswordValidator:

    @staticmethod
    def validate(password: str):
        if not password:
            raise ValidationException("Password is required.")

        if len(password) < 8:
            raise ValidationException("Password must be at least 8 characters long.")

        if not re.search(r"[A-Z]", password):
            raise ValidationException("Password must contain at least one uppercase letter.")

        if not re.search(r"[a-z]", password):
            raise ValidationException("Password must contain at least one lowercase letter.")

        if not re.search(r"\d", password):
            raise ValidationException("Password must contain at least one number.")


class UserProfileValidator:

    @staticmethod
    def validate_name(name: str):
        if not name or not name.strip():
            raise ValidationException("Name is required.")

    @staticmethod
    def validate_birth_date(birth_date):
        if not birth_date:
            raise ValidationException("Birth date is required.")

    @staticmethod
    def validate_phone(phone: str):
        if not phone or not phone.strip():
            raise ValidationException("Phone is required.")

        if len(phone) > 20:
            raise ValidationException("Phone must be at most 20 characters long.")

    @staticmethod
    def validate_profession(profession: str | None):
        if profession and len(profession) > 100:
            raise ValidationException("Profession must be at most 100 characters long.")

    @staticmethod
    def validate_monthly_income(monthly_income):
        if monthly_income is not None and monthly_income < 0:
            raise ValidationException("Monthly income cannot be negative.")
