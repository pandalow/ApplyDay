from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for the Application model. Includes all fields."""

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['id', 'application_date']