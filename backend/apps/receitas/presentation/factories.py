from apps.receitas.application.services import (
    CreateReceitaService,
    DeleteReceitaService,
    ListReceitasService,
    RetrieveReceitaService,
    UpdateReceitaService,
    GetTotalReceitasService
)
from apps.receitas.infrastructure.repositories import ReceitaRepository


def create_receita_service():
    return CreateReceitaService(ReceitaRepository())


def list_receitas_service():
    return ListReceitasService(ReceitaRepository())


def retrieve_receita_service():
    return RetrieveReceitaService(ReceitaRepository())

def get_total_receitas_service():
    return GetTotalReceitasService(ReceitaRepository())


def update_receita_service():
    return UpdateReceitaService(ReceitaRepository())


def delete_receita_service():
    return DeleteReceitaService(ReceitaRepository())
