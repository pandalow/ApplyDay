from rest_framework import serializers
from .models import JobDescriptionText

class JobExtractSerializer(serializers.ModelSerializer):
    """Serializer for the JobDescription model. Includes all fields."""

    class Meta:
        model = JobDescriptionText
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
