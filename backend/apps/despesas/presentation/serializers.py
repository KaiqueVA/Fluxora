from rest_framework import serializers
from apps.despesas.models import Despesa


class DespesaSerializer(serializers.ModelSerializer):
    description = serializers.CharField(source='descricao')
    category = serializers.CharField(source='categoria')
    value = serializers.DecimalField(source='valor', max_digits=10, decimal_places=2)
    date = serializers.DateField(source='data')

    class Meta:
        model = Despesa
        fields = [
            'id',
            'description',
            'category',
            'value',
            'date',
        ]