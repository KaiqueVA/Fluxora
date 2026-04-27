from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Receita(models.Model):
    description = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receitas")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - {self.value}"