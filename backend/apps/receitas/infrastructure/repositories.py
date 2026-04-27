from apps.receitas.models import Receita

class ReceitaRepository:
    
    def save(self, receita_entity):
        return Receita.objects.create(
            descricao=receita_entity.description,
            valor=receita_entity.value,
            data=receita_entity.date,
            usuario=receita_entity.user
        )
        
    def find_by_user(self, user):
        return Receita.objects.filter(usuario=user)
    
    def find_by_id(self, id):
        return Receita.objects.get(id=id)