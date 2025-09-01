from .views import JobExtract
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'', JobExtract, basename='extract')

urlpatterns = router.urls