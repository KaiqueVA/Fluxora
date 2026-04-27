from .exceptions import ValidationException
from datetime import date

class ReceitaValidator:
    
    @staticmethod
    def value_validator(value: float):
        if value is None:
            raise ValidationException("the value must be provided")
        if value <= 0:
            raise ValidationException("the value must be greater than zero")
        
    @staticmethod
    def description_validator(description: str):
        if description is None or description.strip() == "":
            raise ValidationException("the description must be provided")
        
    @staticmethod
    def date_validator(date: date):
        if date is None:
            raise ValidationException("the date must be provided")
        