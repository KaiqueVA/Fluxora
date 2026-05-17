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
