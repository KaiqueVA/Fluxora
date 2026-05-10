from apps.despesas.models import Despesa


class DespesaRepository:

    def create(self, despesa_entity):
        return Despesa.objects.create(
            user=despesa_entity.user,
            descricao=despesa_entity.descricao,
            categoria=despesa_entity.categoria,
            valor=despesa_entity.valor,
            data=despesa_entity.data,
        )

    def list_by_user(self, user):
        return Despesa.objects.filter(user=user)

    def get_by_id_for_user(self, despesa_id, user):
        return Despesa.objects.filter(id=despesa_id, user=user).first()

    def update(self, despesa, data):
        despesa.descricao = data.get("descricao", despesa.descricao)
        despesa.categoria = data.get("categoria", despesa.categoria)
        despesa.valor = data.get("valor", despesa.valor)
        despesa.data = data.get("data", despesa.data)
        despesa.save()
        return despesa

    def delete(self, despesa):
        despesa.delete()