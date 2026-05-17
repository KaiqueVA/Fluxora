from datetime import date
from decimal import Decimal, InvalidOperation

from apps.metas.domain.exceptions import ValidationException


class MetaFinanceiraValidator:

    @staticmethod
    def name_validator(name):
        if not name:
            raise ValidationException("Name is required.")

        if len(name.strip()) < 3:
            raise ValidationException("Name must have at least 3 characters.")

    @staticmethod
    def target_value_validator(target_value):
        if target_value is None:
            raise ValidationException("Target value is required.")

        try:
            value = Decimal(target_value)
        except (InvalidOperation, TypeError):
            raise ValidationException("Target value must be a valid number.")

        if value <= 0:
            raise ValidationException("Target value must be greater than zero.")

    @staticmethod
    def deadline_validator(deadline):
        if deadline is None:
            raise ValidationException("Deadline is required.")

        if deadline < date.today():
            raise ValidationException("Deadline cannot be in the past.")