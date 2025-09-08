# backend/applyday/report/models.py
# Author: Zhuang Xiaojian 
from django.db import models

class AnalysisReport(models.Model):
    """Model representing an analysis report."""
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report {self.id} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
    
class AnalysisResult(models.Model):
    """Model representing a result within an analysis report."""
    report  = models.ForeignKey(AnalysisReport, on_delete=models.CASCADE, related_name="results")
    name = models.CharField(max_length=100)
    result = models.JSONField(null=True, blank=True)


class Summary(models.Model):
    """Summary of the analysis report."""
    report = models.ForeignKey(AnalysisReport, on_delete=models.CASCADE, related_name="summary")
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Summary for Report {self.report.id} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

