# backend/applyday/application/serializers.py
# Author: Zhuang Xiaojian <zxj000hugh@gmail.com>

from PyPDF2 import PdfReader
from rest_framework import serializers

from .models import Application, JobDescription, JobDescriptionText, ResumeText

class JobDescriptionTextSerializer(serializers.ModelSerializer):
    """Serializer for the JobDescription Text model. Includes all fields."""
    application = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = JobDescriptionText
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'application']

class JobDescriptionSerializer(serializers.ModelSerializer):
    """Serializer for the JobDescription model. Includes all fields."""
    job_text = JobDescriptionTextSerializer(read_only=True)
    class Meta:
        model = JobDescription
        fields = '__all__'
        read_only_fields = ['created_at', 'job_text']


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Application model.
    Includes nested job description text handling.
    """

    job_description = serializers.CharField(
        source="apply_description.text",
        required=False,
        allow_blank=True
    )

    class Meta:
        model = Application
        fields = ["id", "company", "job_title", "application_date", "status", "stage_notes", "job_description"]

    def create(self, validated_data):
        """
        Handle nested job description text creation.
        if job description text is provided, create a JobDescriptionText instance
        """
        job_desc_text = None
        if "apply_description" in validated_data:
            job_desc_text = validated_data.pop("apply_description").get("text")

        application = super().create(validated_data)

        if job_desc_text:
            JobDescriptionText.objects.create(application=application, text=job_desc_text)

        return application

    def update(self, instance, validated_data):
        """
        Handle nested job description text update.
        if job description text is provided, update JobDescriptionText instance
        """
        job_desc_text = None
        if "apply_description" in validated_data:
            job_desc_text = validated_data.pop("apply_description").get("text")

        application = super().update(instance, validated_data)

        if job_desc_text is not None:
            if hasattr(application, "apply_description"):
                application.apply_description.text = job_desc_text
                application.apply_description.save()
            else:
                JobDescriptionText.objects.create(application=application, text=job_desc_text)

        return application


class ResumeTextSerializer(serializers.ModelSerializer):
    """Serializer for the ResumeText model. Handles PDF file uploads and text extraction."""
    file = serializers.FileField(write_only=True) # Accept file uploads

    class Meta:
        model = ResumeText
        fields = ["id", "name", "file", "text", "uploaded_at"]
        read_only_fields = ["text"]


    def create(self, validated_data):
        """
        Handle PDF file upload and extract text using PyPDF2.
        Extracted text is saved in the 'text' field.
        """
        pdf_file = validated_data.pop("file")
        pdf_file.seek(0)

        reader = PdfReader(pdf_file.file)
        text = "\n".join([page.extract_text() or "" for page in reader.pages])

        validated_data["text"] = text
        return ResumeText.objects.create(**validated_data)