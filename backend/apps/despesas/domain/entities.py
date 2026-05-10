from apps.despesas.domain.validators import DespesaValidator


class DespesaEntity:

    def __init__(self, descricao, categoria, valor, data, user):
        self.descricao = descricao
        self.categoria = categoria
        self.valor = valor
        self.data = data
        self.user = user

        DespesaValidator.validate({
            "descricao": descricao,
            "categoria": categoria,
            "valor": valor,
            "data": data,
        })