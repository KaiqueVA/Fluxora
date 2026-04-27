from rest_framework import serializers

class ReceitaSerializer(serializers.Serializer):
    description = serializers.CharField(source='descricao')
    value = serializers.DecimalField(max_digits=10, decimal_places=2, source='valor')
    date = serializers.DateField(source='data')