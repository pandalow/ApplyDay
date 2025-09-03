from rest_framework.serializers import Serializer, ModelSerializer

from .models import JobDescription, AnalysisReport, AnalysisResult

class JobDescriptionSerializer(ModelSerializer):
    class Meta:
        model = JobDescription
        fields = '__all__'

    read_only_fields = ['created_at']

class AnalysisResultSerializer(ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = ["id", "name", "result"]   # 👈 记得包含 result

        read_only_fields = ['id', 'name', 'result']

class AnalysisReportSerializer(ModelSerializer):
    results = AnalysisResultSerializer(many=True, read_only=True)
    class Meta:
        model = AnalysisReport
        fields = ["id", "created_at", "results"]

    read_only_fields = ['created_at']


