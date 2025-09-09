# backend/applyday/application/views.py
# Author: Zhuang Xiaojian 

from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import ApplicationSerializer, JobDescriptionTextSerializer, JobDescriptionSerializer, ResumeTextSerializer
from .models import Application , JobDescription, JobDescriptionText, ResumeText

class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing applications.
    Provides CRUD operations and custom actions.
    plus additional 'stat' action to get application statistics.
    """
    
    serializer_class = ApplicationSerializer
    queryset = Application.objects.all().order_by('-created_at')  # Sort by precise timestamp

    def get_queryset(self):
        """
        Filter applications based on query parameters.
        Args:
            job_title (str): Filter by job title (partial match).
            company (str): Filter by company name (partial match).
            status (str): Filter by application status (exact match).
                in ['prepared', 'applied', 'interviewed', 'offered', 'rejected']
        Returns:
            QuerySet: Filtered applications queryset.
        """
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
        Returns:
            JSON response with total applications and counts by status.
        """
        total_applications = {
            'total': Application.objects.count(),
            'applied': Application.objects.filter(status='applied').count(),
            'rejected': Application.objects.filter(status='rejected').count(),
            'interviewed': Application.objects.filter(status='interviewed').count(), 
            "offered": Application.objects.filter(status='offered').count(),
        }
        return Response({'data': total_applications}, status=status.HTTP_200_OK)

class JDViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing job descriptions.
    Provides CRUD operations.
    """
    queryset = JobDescription.objects.all().order_by('-created_at')
    serializer_class = JobDescriptionSerializer


class JobExtract(viewsets.ModelViewSet):
    """
    ViewSet for managing job extraction.
    """
    serializer_class = JobDescriptionTextSerializer
    queryset = JobDescriptionText.objects.all()

    def partial_update(self, request , *args, **kwargs):
        """
        ViewSet for managing job extraction.
        Only allows partial updates on the 'text' field.
        """
        allowed_fields = ["text"]

        update_field = set(request.data.keys())
        if not update_field.issubset(allowed_fields):
            return Response({"error": "Invalid fields for partial update."}, status=status.HTTP_400_BAD_REQUEST)
        
        filtered_data  = {key:value for key, value in request.data.items() if key in allowed_fields}
        serializer = self.get_serializer(self.get_object(), data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ResumeTextViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing resume texts.
    Provides CRUD operations and handles PDF uploads.
    Args:
        file (File): PDF file upload.
    """
    queryset = ResumeText.objects.all()
    serializer_class = ResumeTextSerializer