from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    birth_date = serializers.DateField(required=False, allow_null=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    profession = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    monthly_income = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        allow_null=True,
        min_value=0,
    )
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class PhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)


class ProfessionSerializer(serializers.Serializer):
    profession = serializers.CharField(
        max_length=100,
        allow_blank=True,
        allow_null=True,
    )


class MonthlyIncomeSerializer(serializers.Serializer):
    monthly_income = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        allow_null=True,
        min_value=0,
    )
