from apps.interfaces import UserScopedRepositoryInterface
from apps.metas.models import MetaFinanceira


class MetaFinanceiraRepository(UserScopedRepositoryInterface):

    def create(self, meta_entity):
        return MetaFinanceira.objects.create(
            name=meta_entity.name,
            description=meta_entity.description,
            target_value=meta_entity.target_value,
            deadline=meta_entity.deadline,
            user=meta_entity.user
        )

    def list_by_user(self, user):
        return MetaFinanceira.objects.filter(user=user)

    def get_by_id_for_user(self, meta_id, user):
        return MetaFinanceira.objects.filter(
            id=meta_id,
            user=user
        ).first()

    def get_total_sum_by_user(self, user):
        metas = MetaFinanceira.objects.filter(user=user).values_list(
            "target_value",
            flat=True
        )

        total = 0

        for meta in metas:
            total += meta

        return total

    def update(self, meta, meta_entity):
        meta.name = meta_entity.name
        meta.description = meta_entity.description
        meta.target_value = meta_entity.target_value
        meta.deadline = meta_entity.deadline
        meta.user = meta_entity.user
        meta.save()

        return meta

    def delete(self, meta):
        meta.delete()