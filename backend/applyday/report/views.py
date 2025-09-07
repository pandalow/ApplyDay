from rest_framework import viewsets, status
from rest_framework.response import Response
from django.forms.models import model_to_dict
from django.utils.timezone import make_aware
from datetime import datetime
from rest_framework.decorators import action

from .models import AnalysisReport
from .serializers import  AnalysisReportSerializer
from .services.generate_report import AnalysisService
from .services.analyst import Analyst
from ai.services.extract_jd import process_extract
from application.models import JobDescription, Application
from report.services.pipeline_service import PipelineService


class ReportViewSet(viewsets.ModelViewSet):


    queryset = AnalysisReport.objects.all().prefetch_related("results")
    serializer_class = AnalysisReportSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        job_ids = request.data.get("job_ids")
        start_at = request.data.get("start_at")
        end_at = request.data.get("end_at")

        if job_ids:
            jds = JobDescription.objects.filter(id__in=job_ids)
        elif start_at and end_at:
            start = make_aware(datetime.fromisoformat(start_at))
            end = make_aware(datetime.fromisoformat(end_at))
            jds = JobDescription.objects.filter(created_at__range=(start, end))
        else:
            jds = JobDescription.objects.all()

        jd_dicts = [model_to_dict(jd) for jd in jds]
        ana = Analyst(jd_dicts)

        report = AnalysisService.generate_report(ana)

        return Response(self.get_serializer(report).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='extract')
    def process_extract(self, request, *args, **kwargs):

        start = request.data.get("start")
        end = request.data.get('end')
        ids = request.data.get("job_ids", [])
        
        if ids:
            process_extract(job_ids=ids)
        elif start and end:
            process_extract(start=start, end=end)
        else:
            process_extract()

        return Response({"message": "Extraction completed"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='run')
    def pipeline(self, request, *args, **kwargs):
        job_ids = request.data.get("job_ids", [])
        resume_id = request.data.get("resume_id")
        languages = request.data.get("languages" )


        report = PipelineService.run_extraction_pipeline(job_ids=job_ids or None)
        summary = PipelineService.run_insight_pipeline(report.id, resume_id, languages=languages)

        serializer = AnalysisReportSerializer(report)
        return Response(
        {
            "report": serializer.data,
            "summary": summary, 
        },
        status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], url_path='insight')
    def create_summary(self, request, pk=None):
        resume_id = request.data.get("resume_id")
        summary = PipelineService.run_insight_pipeline(pk, resume_id, languages="en")
        return Response({"summary": summary}, status=status.HTTP_200_OK)



