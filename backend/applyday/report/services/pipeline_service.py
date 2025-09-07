from django.forms.models import model_to_dict

from application.models import Application
from ai.services.extract_jd import process_extract
from ai.services.get_insights import get_insights
from report.services.generate_report import AnalysisService
from report.services.analyst import Analyst

class PipelineService:
    
    @staticmethod
    def run_extraction_pipeline(job_ids=None):

        applications = Application.objects.filter(id__in=job_ids) if job_ids else Application.objects.all()
        jd_texts = [app.apply_description for app in applications if hasattr(app, "apply_description")] # type: ignore

        if not jd_texts:
            raise ValueError("No job descriptions found for the given applications.")
        jd_ids = [jt.id for jt in jd_texts]
        jds = process_extract(job_ids=jd_ids)

        jd_dicts = [model_to_dict(j) for j in jds]
        analyst = Analyst(jd_dicts)
        report = AnalysisService.generate_report(analyst)

        return report
    

    @staticmethod
    def run_insight_pipeline(report_id, resume_id):
        report = get_insights(report_id, resume_id)
        return report