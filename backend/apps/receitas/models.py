from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Receita(models.Model):
    descricao  = models.CharField(max_length=255)
    valor  = models.DecimalField(max_digits=10, decimal_places=2)
    data  = models.DateField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receitas")
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.descricao} - {self.valor}"