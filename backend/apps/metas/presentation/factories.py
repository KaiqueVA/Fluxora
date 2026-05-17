from apps.metas.application.services import (
    CreateMetaFinanceiraService,
    DeleteMetaFinanceiraService,
    ListMetasFinanceirasService,
    RetrieveMetaFinanceiraService,
    UpdateMetaFinanceiraService,
)
from apps.metas.infrastructure.repositories import MetaFinanceiraRepository


def create_meta_financeira_service():
    return CreateMetaFinanceiraService(MetaFinanceiraRepository())


def list_metas_financeiras_service():
    return ListMetasFinanceirasService(MetaFinanceiraRepository())


def retrieve_meta_financeira_service():
    return RetrieveMetaFinanceiraService(MetaFinanceiraRepository())


def update_meta_financeira_service():
    return UpdateMetaFinanceiraService(MetaFinanceiraRepository())


def delete_meta_financeira_service():
    return DeleteMetaFinanceiraService(MetaFinanceiraRepository())