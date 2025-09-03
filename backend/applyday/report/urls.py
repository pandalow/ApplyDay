from rest_framework.routers import DefaultRouter
from .views import JDViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'jd', JDViewSet, basename='jobdescription')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = router.urls
