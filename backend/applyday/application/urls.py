from .views import ApplicationViewSet, JobExtract, JDViewSet, ResumeTextViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path


router = DefaultRouter()
router.register(r'info', ApplicationViewSet, basename='application')
router.register(r'extract', JobExtract, basename='job_extract')
router.register(r'jd', JDViewSet, basename='job_description')
router.register(r'resumes', ResumeTextViewSet, basename='resume')
urlpatterns = router.urls

