from rest_framework import serializers

class SaldoSerializer(serializers.Serializer):
    periodo = serializers.CharField(allow_null=True)
    data_inicio = serializers.DateField(allow_null=True)
    data_fim = serializers.DateField(allow_null=True)
    total_receitas = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_despesas = serializers.DecimalField(max_digits=10, decimal_places=2)
    saldo = serializers.DecimalField(max_digits=10, decimal_places=2)