from apps.receitas.application.services import (
    CreateReceitaService,
    DeleteReceitaService,
    ListReceitasService,
    RetrieveReceitaService,
    UpdateReceitaService,
)
from apps.receitas.infrastructure.repositories import ReceitaRepository


def create_receita_service():
    return CreateReceitaService(ReceitaRepository())


def list_receitas_service():
    return ListReceitasService(ReceitaRepository())


def retrieve_receita_service():
    return RetrieveReceitaService(ReceitaRepository())


def update_receita_service():
    return UpdateReceitaService(ReceitaRepository())


def delete_receita_service():
    return DeleteReceitaService(ReceitaRepository())
