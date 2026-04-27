from apps.receitas.domain.validators import ReceitaValidator
from apps.receitas.domain.entities import ReceitaEntity

class CreateReceitaService:
    
    def __init__(self, repository):
        self.repository = repository
        
    def execute(self, data):
        ReceitaValidator.value_validator(data.get("value"))
        ReceitaValidator.description_validator(data.get("description"))
        ReceitaValidator.date_validator(data.get("date"))
        
        receita = ReceitaEntity(
            description=data.get("description"),
            value=data.get("value"),
            date=data.get("date"),
            user=data.get("user"),
        )
        return self.repository.save(receita)