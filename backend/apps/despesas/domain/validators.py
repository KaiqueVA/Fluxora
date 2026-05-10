from datetime import date
from decimal import Decimal

from apps.despesas.domain.exceptions import ValidationException


class DespesaValidator:

    @staticmethod
    def validate_description(description):
        if not description:
            raise ValidationException("A descrição é obrigatória.")

    @staticmethod
    def validate_category(category):
        if not category:
            raise ValidationException("A categoria é obrigatória.")

    @staticmethod
    def validate_value(value):
        if value is None:
            raise ValidationException("O valor é obrigatório.")

        if Decimal(value) <= 0:
            raise ValidationException("O valor deve ser maior que zero.")

    @staticmethod
    def validate_date(expense_date):
        if not expense_date:
            raise ValidationException("A data é obrigatória.")

        if expense_date > date.today():
            raise ValidationException("A data não pode ser futura.")

    @classmethod
    def validate(cls, data):
        cls.validate_description(data.get("descricao"))
        cls.validate_category(data.get("categoria"))
        cls.validate_value(data.get("valor"))
        cls.validate_date(data.get("data"))