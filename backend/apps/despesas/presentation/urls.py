from rest_framework.routers import DefaultRouter

from apps.despesas.presentation.views import DespesaViewSet


router = DefaultRouter()
router.register(r'despesas', DespesaViewSet, basename='despesas')

urlpatterns = router.urls