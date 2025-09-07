from rest_framework.routers import DefaultRouter
from .views import ReportViewSet

router = DefaultRouter()
router.register(r'', ReportViewSet, basename='report')
urlpatterns = router.urls
