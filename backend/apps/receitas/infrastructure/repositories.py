from apps.receitas.models import Receita

class ReceitaRepository:
    
    def save(self, receita_entity):
        return Receita.objects.create(
            description=receita_entity.description,
            value=receita_entity.value,
            date=receita_entity.date,
            user=receita_entity.user
        )
        
    def find_by_user(self, user):
        return Receita.objects.filter(user=user)
    
    def find_by_id_and_user(self, receita_id, user):
        return Receita.objects.filter(
            id=receita_id,
            user=user
        ).first()
    
    def update(self, receita, receita_entity):
        receita.description = receita_entity.description
        receita.value = receita_entity.value
        receita.date = receita_entity.date
        receita.user = receita_entity.user
        receita.save()
        return receita
    
    def delete(self, receita):
        receita.delete()