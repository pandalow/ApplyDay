from django.db import models
from application.models import Application
# Create your models here.

class JobDescriptionText(models.Model):
    application = models.OneToOneField(Application, on_delete=models.SET_NULL, related_name="apply_description", null=True, blank=True)
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)