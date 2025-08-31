from .views import ApplicationViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'', ApplicationViewSet, basename='application')

urlpatterns = router.urls