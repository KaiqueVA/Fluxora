from rest_framework import serializers

class ReceitaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    description = serializers.CharField()
    value = serializers.DecimalField(max_digits=10, decimal_places=2)
    date = serializers.DateField()
    
    