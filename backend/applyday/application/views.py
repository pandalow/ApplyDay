from django.shortcuts import  get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import ApplicationSerializer
from .models import Application
from extract.models import JobDescriptionText


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing applications.
    Provides CRUD operations and custom actions.
    plus additional 'stat' action to get application statistics.
    """
    
    serializer_class = ApplicationSerializer
    queryset = Application.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        job_title = self.request.query_params.get('job_title')
        company = self.request.query_params.get('company')
        status_param = self.request.query_params.get('status')

        if job_title:
            qs = qs.filter(job_title__icontains=job_title)
        if company:
            qs = qs.filter(company__icontains=company)
        if status_param:
            qs = qs.filter(status=status_param.lower())
        return qs

    @action(detail=False, methods=['get'])
    def get_stats(self, request, *args, **kwargs):
        """
        Custom action to get application statistics.
        """
        total_applications = {
            'total': Application.objects.count(),
            'applied': Application.objects.filter(status='applied').count(),
            'rejected': Application.objects.filter(status='rejected').count(),
            'interviewed': Application.objects.filter(status='interviewed').count(), 
            "offered": Application.objects.filter(status='offered').count(),
        }
        return Response({'data': total_applications}, status=status.HTTP_200_OK)
