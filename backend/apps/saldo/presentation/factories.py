from apps.receitas.infrastructure.repositories import ReceitaRepository
from apps.despesas.infrastructure.repositories import DespesaRepository
from apps.saldo.application.services import GetSaldoService

def get_saldo_service():
    return GetSaldoService(
        receita_repository=ReceitaRepository(),
        despesa_repository=DespesaRepository(),
    )