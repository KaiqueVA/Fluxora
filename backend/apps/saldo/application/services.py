from datetime import date, timedelta


class GetSaldoService:
    
    PERIODOS_VALIDOS = ['dia', 'semana', 'mes', 'ano']
    
    def __init__(self, receita_repository, despesa_repository):
        self.receita_repository = receita_repository
        self.despesa_repository = despesa_repository

    def execute(self, user, periodo=None, data_base=None):
        if periodo is None:
            total_receitas = self.receita_repository.get_total_sum_by_user(user)
            total_despesas = self.despesa_repository.get_total_sum_by_user(user)

            return self.__build_response(
                total_receitas=total_receitas,
                total_despesas=total_despesas,
                periodo=None,
                data_inicio=None,
                data_fim=None,
            )

        if periodo not in self.PERIODOS_VALIDOS:
            raise ValueError("Período inválido. Use: dia, semana, mes ou ano.")

        data_inicio, data_fim = self.__get_date_range(periodo, data_base)

        total_receitas = self.receita_repository.get_total_sum_by_user_between_dates(
            user=user,
            start_date=data_inicio,
            end_date=data_fim,
        )

        total_despesas = self.despesa_repository.get_total_sum_by_user_between_dates(
            user=user,
            start_date=data_inicio,
            end_date=data_fim,
        )

        return self.__build_response(
            total_receitas=total_receitas,
            total_despesas=total_despesas,
            periodo=periodo,
            data_inicio=data_inicio,
            data_fim=data_fim,
        )
    
    def __get_date_range(self, periodo, data_base):
        if data_base is None:
            data_base = date.today()

        if periodo == "dia":
            return data_base, data_base

        if periodo == "semana":
            inicio_semana = data_base - timedelta(days=data_base.weekday())
            fim_semana = inicio_semana + timedelta(days=6)
            return inicio_semana, fim_semana

        if periodo == "mes":
            inicio_mes = data_base.replace(day=1)

            if data_base.month == 12:
                proximo_mes = data_base.replace(
                    year=data_base.year + 1,
                    month=1,
                    day=1,
                )
            else:
                proximo_mes = data_base.replace(
                    month=data_base.month + 1,
                    day=1,
                )

            fim_mes = proximo_mes - timedelta(days=1)
            return inicio_mes, fim_mes

        if periodo == "ano":
            inicio_ano = data_base.replace(month=1, day=1)
            fim_ano = data_base.replace(month=12, day=31)
            return inicio_ano, fim_ano
        
    def __build_response(
        self,
        total_receitas,
        total_despesas,
        periodo,
        data_inicio,
        data_fim,
    ):
        saldo = total_receitas - total_despesas

        return {
            "periodo": periodo,
            "data_inicio": data_inicio,
            "data_fim": data_fim,
            "total_receitas": total_receitas,
            "total_despesas": total_despesas,
            "saldo": saldo,
        }