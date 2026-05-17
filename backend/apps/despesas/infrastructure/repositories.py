from apps.despesas.models import Despesa
from apps.interfaces import UserScopedRepositoryInterface
from decimal import Decimal


class DespesaRepository(UserScopedRepositoryInterface):

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

    def get_total_sum_by_user(self, user):
        despesas = Despesa.objects.filter(user=user).values_list('valor', flat=True)
        return sum(despesas, Decimal("0.00"))

    def get_total_sum_by_user_between_dates(self, user, start_date, end_date):
        despesas = Despesa.objects.filter(
            user=user,
            data__range=[start_date, end_date]
        )

        total = Decimal("0.00")

        for despesa in despesas:
            total += despesa.valor

        return total

    def update(self, despesa, data):
        despesa.descricao = data.get("descricao", despesa.descricao)
        despesa.categoria = data.get("categoria", despesa.categoria)
        despesa.valor = data.get("valor", despesa.valor)
        despesa.data = data.get("data", despesa.data)
        despesa.save()
        return despesa

    def delete(self, despesa):
        despesa.delete()
