from apps.despesas.application.services import (
    CreateDespesaService,
    DeleteDespesaService,
    ListDespesasService,
    RetrieveDespesaService,
    UpdateDespesaService,
    GetTotalDespesasService
)
from apps.despesas.infrastructure.repositories import DespesaRepository


def create_despesa_service():
    return CreateDespesaService(DespesaRepository())


def list_despesas_service():
    return ListDespesasService(DespesaRepository())


def retrieve_despesa_service():
    return RetrieveDespesaService(DespesaRepository())

def get_total_despesas_service():
    return GetTotalDespesasService(DespesaRepository())

def update_despesa_service():
    return UpdateDespesaService(DespesaRepository())


def delete_despesa_service():
    return DeleteDespesaService(DespesaRepository())
