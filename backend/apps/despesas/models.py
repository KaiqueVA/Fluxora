from django.db import models
from django.conf import settings


class Despesa(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='despesas'
    )
    descricao = models.CharField(max_length=255)
    categoria = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-data', '-created_at']

    def __str__(self):
        return f'{self.descricao} - R$ {self.valor}'