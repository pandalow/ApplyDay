from django.shortcuts import  get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import ApplicationSerializer
from .models import Application


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

    def partial_update(self, request, *args, **kwargs):
        """
        Restrict partial updates to only the 'status', 'stage_notes', and 'job_description' fields.
        """
        allowed_fields = {'status', 'stage_notes', 'job_description'}
        
        update_fields = set(request.data.keys())
        if not update_fields.issubset(allowed_fields):
            return Response({"error": "Invalid fields for partial update."}, status=status.HTTP_400_BAD_REQUEST)

        # filter the data to only include allowed fields
        filtered_data = {key: value for key, value in request.data.items() if key in allowed_fields}
        serializer = self.get_serializer(self.get_object(), data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

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
