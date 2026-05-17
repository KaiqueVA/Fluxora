from apps.interfaces import UserScopedRepositoryInterface
from apps.metas.domain.entities import MetaFinanceiraEntity
from apps.metas.domain.validators import MetaFinanceiraValidator


class CreateMetaFinanceiraService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, data):
        MetaFinanceiraValidator.name_validator(data.get("name"))
        MetaFinanceiraValidator.target_value_validator(data.get("target_value"))
        MetaFinanceiraValidator.deadline_validator(data.get("deadline"))

        meta = MetaFinanceiraEntity(
            name=data.get("name"),
            description=data.get("description"),
            target_value=data.get("target_value"),
            deadline=data.get("deadline"),
            user=data.get("user"),
        )

        return self.repository.create(meta)


class ListMetasFinanceirasService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, user):
        return self.repository.list_by_user(user)


class RetrieveMetaFinanceiraService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, meta_id, user):
        return self.repository.get_by_id_for_user(meta_id, user)


class UpdateMetaFinanceiraService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, meta_id, user, data):
        meta = self.repository.get_by_id_for_user(meta_id, user)

        if meta is None:
            return None

        MetaFinanceiraValidator.name_validator(data.get("name"))
        MetaFinanceiraValidator.target_value_validator(data.get("target_value"))
        MetaFinanceiraValidator.deadline_validator(data.get("deadline"))

        meta_entity = MetaFinanceiraEntity(
            name=data.get("name"),
            description=data.get("description"),
            target_value=data.get("target_value"),
            deadline=data.get("deadline"),
            user=user,
        )

        return self.repository.update(meta, meta_entity)


class DeleteMetaFinanceiraService:

    def __init__(self, repository: UserScopedRepositoryInterface):
        self.repository = repository

    def execute(self, meta_id, user):
        meta = self.repository.get_by_id_for_user(meta_id, user)

        if meta is None:
            return False

        self.repository.delete(meta)
        return True