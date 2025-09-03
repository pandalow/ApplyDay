from django.db import models

# Create your models here.

class JobDescription(models.Model):
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


class AnalysisReport(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"Report {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
    

class AnalysisResult(models.Model):
    report  = models.ForeignKey(AnalysisReport, on_delete=models.CASCADE, related_name="results")
    name = models.CharField(max_length=100)
    result = models.JSONField(null=True, blank=True)








