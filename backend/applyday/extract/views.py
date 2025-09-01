from django.shortcuts import  get_object_or_404
from datetime import datetime
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .serializers import JobExtractSerializer
from .models import JobDescriptionText
from .services.extraction import process_extract


class JobExtract(viewsets.ModelViewSet):
    """
    """

    serializer_class = JobExtractSerializer
    queryset = JobDescriptionText.objects.all()

    def partial_update(self, request , *args, **kwargs):
        """
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
    
    @action(detail=False, methods=['post'])
    def process_extract(self, request, *args, **kwargs):

        start = request.data.get("start")
        end = request.data.get('end')

        if not (start and end):
            return Response({"error": "Both 'start' and 'end' are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            start_dt = datetime.fromisoformat(start)
            end_dt = datetime.fromisoformat(end)
        except ValueError:
            return Response({"error": "Invalid datetime format, must be ISO 8601"},
                            status=status.HTTP_400_BAD_REQUEST)
        process_extract(start=start, end=end)
        
        return Response({"message": "Extraction completed"}, status=status.HTTP_200_OK)

