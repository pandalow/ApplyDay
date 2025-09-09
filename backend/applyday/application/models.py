# backend/applyday/application/models.py
# Author: Zhuang Xiaojian <zxj000hugh@gmail.com>

from django.db import models
from django.core.validators import FileExtensionValidator

class Application(models.Model):
    """
    Model representing a job application.
    ONE-TO-ONE relationship with JobDescriptionText for storing job description text.
    """
    STATUS_CHOICES = [
        ('prepared', 'Prepared'),
        ('applied', 'Applied'),
        ('interviewed', 'Interviewed'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
    ]
    company = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    application_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Add precise timestamp for sorting
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    stage_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.job_title} at {self.company}"
    
    class Meta:
        ordering = ['-created_at']  # Sort by precise timestamp instead of date
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'

class JobDescriptionText(models.Model):
    """
    Model to store the raw job description text.
    ONE-TO-ONE relationship with Application.
    """
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name="apply_description", null=True, blank=True)
    text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class JobDescription(models.Model):
    """
    Model to store structured job description data extracted from JobDescriptionText.
    ONE-TO-ONE relationship with JobDescriptionText.
    """
    job_text = models.OneToOneField(JobDescriptionText, on_delete=models.CASCADE, related_name="text_description")
    
    # Fields for structured job description data
    created_at = models.DateTimeField(auto_now_add=True)
    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255, null=True, blank=True)
    level = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    employment_type = models.CharField(max_length=255)
    salary_eur_min = models.FloatField(null=True, blank=True)
    salary_eur_max = models.FloatField(null=True, blank=True)
    bonus_percent = models.FloatField(null=True, blank=True)
    benefits = models.JSONField(null=True, blank=True)
    years_experience_min = models.IntegerField(null=True, blank=True)
    years_experience_max = models.IntegerField(null=True, blank=True)
    education_required = models.TextField(null=True, blank=True)
    responsibilities = models.JSONField(null=True, blank=True)
    required_core_skills = models.JSONField(null=True, blank=True)
    desirable_skills = models.JSONField(null=True, blank=True)
    programming_languages = models.JSONField(null=True, blank=True)
    frameworks_tools = models.JSONField(null=True, blank=True)
    databases = models.JSONField(null=True, blank=True)
    cloud_platforms = models.JSONField(null=True, blank=True)
    api_protocols = models.JSONField(null=True, blank=True)
    methodologies = models.JSONField(null=True, blank=True)
    mobile_technologies = models.JSONField(null=True, blank=True)
    domain_keywords = models.JSONField(null=True, blank=True)
    remote_work = models.CharField(
        max_length=20,
        choices=[("remote", "Remote"), ("hybrid", "Hybrid"), ("on-site", "On-Site")],
        null=True
    )
    work_permit_required = models.BooleanField(null=True)
    visa_sponsorship = models.BooleanField(null=True)
    contact_person = models.CharField(max_length=255, null=True)
    contact_email_or_phone = models.CharField(max_length=255, null=True)
    industry = models.CharField(max_length=255, null=True)
    language_requirements = models.JSONField(null=True, blank=True)

class ResumeText(models.Model):
    """Model to store uploaded resume files and extracted text."""
    name = models.CharField(max_length=100)
    text = models.TextField()  # The extracted text from the resume
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name