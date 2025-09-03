from rest_framework import viewsets, status
from rest_framework.response import Response
from django.forms.models import model_to_dict
from django.utils.timezone import make_aware
from datetime import datetime

from .models import JobDescription, AnalysisReport
from .serializers import JobDescriptionSerializer, AnalysisReportSerializer
from .services.generate_report import AnalysisService
from .services.analyst import Analyst


class JDViewSet(viewsets.ModelViewSet):
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer


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
