from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.presentation.views import (
    LoginView,
    RegisterView,
    UserMonthlyIncomeView,
    UserPhoneView,
    UserProfessionView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("phone/", UserPhoneView.as_view(), name="user_phone"),
    path("profession/", UserProfessionView.as_view(), name="user_profession"),
    path(
        "monthly-income/",
        UserMonthlyIncomeView.as_view(),
        name="user_monthly_income",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
