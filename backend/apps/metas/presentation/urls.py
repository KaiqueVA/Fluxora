from rest_framework.routers import DefaultRouter

from apps.metas.presentation.views import MetaFinanceiraViewSet

router = DefaultRouter()
router.register(r"metas", MetaFinanceiraViewSet, basename="metas")

urlpatterns = router.urls