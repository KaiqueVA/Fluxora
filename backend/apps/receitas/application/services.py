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
    

class ListReceitasService:
    
    def __init__(self, repository):
        self.repository = repository
        
    def execute(self, user):
        return self.repository.find_by_user(user)


class RetrieveReceitaService:

    def __init__(self, repository):
        self.repository = repository

    def execute(self, receita_id, user):
        return self.repository.find_by_id_and_user(receita_id, user)
    
    
class UpdateReceitaService:

    def __init__(self, repository):
        self.repository = repository

    def execute(self, receita_id, user, data):
        receita = self.repository.find_by_id_and_user(receita_id, user)

        if receita is None:
            return None
        
        ReceitaValidator.value_validator(data.get("value"))
        ReceitaValidator.description_validator(data.get("description"))
        ReceitaValidator.date_validator(data.get("date"))
        
        receita_entity = ReceitaEntity(
            description=data.get("description"),
            value=data.get("value"),
            date=data.get("date"),
            user=user,
        )

        return self.repository.update(receita, receita_entity)
    

class DeleteReceitaService:

    def __init__(self, repository):
        self.repository = repository

    def execute(self, receita_id, user):
        receita = self.repository.find_by_id_and_user(receita_id, user)

        if receita is None:
            return False
        
        self.repository.delete(receita)
        return True