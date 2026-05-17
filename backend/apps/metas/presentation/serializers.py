from rest_framework import serializers


class MetaFinanceiraSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )
    target_value = serializers.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    deadline = serializers.DateField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)