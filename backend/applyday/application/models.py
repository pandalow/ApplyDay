from django.db import models



class Application(models.Model):
    """Model representing a job application."""
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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    stage_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.job_title} at {self.company}"
    
    class Meta:
        ordering = ['-application_date']
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
