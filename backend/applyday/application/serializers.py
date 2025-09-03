from rest_framework import serializers
from .models import Application
from extract.serializers import JobExtractSerializer
from extract.models import JobDescriptionText

class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for the Application model. Includes all fields."""
    apply_description = JobExtractSerializer(many = False, read_only = True)
    job_description = serializers.CharField(write_only = True, required = False, allow_blank=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['id',]

    def create(self, validated_data):
        job_description = validated_data.pop("job_description", None)
        application = super().create(validated_data=validated_data)

        if job_description:
            JobDescriptionText.objects.create(application=application, text=job_description)

        return application

    def update(self, instance, validated_data):
        job_description = validated_data.pop("job_description", None)
        application = super().update(instance=instance, validated_data=validated_data)

        if job_description:
            if hasattr(application, "apply_description"):
                application.apply_description.text = job_description
                application.apply_description.save()
            else:
                JobDescriptionText.objects.create(application=application, text = job_description)
            
        return application