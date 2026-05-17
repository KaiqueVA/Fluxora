from django.urls import path

from apps.saldo.presentation.views import SaldoView

urlpatterns = [
    path('', SaldoView.as_view(), name='saldo'),
]