from apps.despesas.domain.entities import DespesaEntity
from apps.despesas.domain.validators import DespesaValidator
from apps.despesas.domain.exceptions import DespesaNotFoundException
from apps.interfaces import UserScopedRepositoryInterface


class CreateDespesaService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, data, user):
        despesa_entity = DespesaEntity(
            descricao=data.get("descricao"),
            categoria=data.get("categoria"),
            valor=data.get("valor"),
            data=data.get("data"),
            user=user,
        )

        return self.repository.create(despesa_entity)


class ListDespesasService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, user):
        return self.repository.list_by_user(user)


class RetrieveDespesaService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, despesa_id, user):
        despesa = self.repository.get_by_id_for_user(despesa_id, user)

        if not despesa:
            raise DespesaNotFoundException("Despesa não encontrada.")

        return despesa

class GetTotalDespesasService:
    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, user):
        return self.repository.get_total_sum_by_user(user)


class UpdateDespesaService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, despesa_id, data, user):
        despesa = self.repository.get_by_id_for_user(despesa_id, user)

        if not despesa:
            raise DespesaNotFoundException("Despesa não encontrada.")

        validation_data = {
            "descricao": data.get("descricao", despesa.descricao),
            "categoria": data.get("categoria", despesa.categoria),
            "valor": data.get("valor", despesa.valor),
            "data": data.get("data", despesa.data),
        }

        DespesaValidator.validate(validation_data)

        return self.repository.update(despesa, data)


class DeleteDespesaService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, despesa_id, user):
        despesa = self.repository.get_by_id_for_user(despesa_id, user)

        if not despesa:
            raise DespesaNotFoundException("Despesa não encontrada.")

        self.repository.delete(despesa)
