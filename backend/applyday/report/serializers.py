from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import AnalysisReport, AnalysisResult, Summary


class AnalysisResultSerializer(ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = ["id", "name", "result"]   # 👈 记得包含 result
        read_only_fields = ['id', 'name', 'result']

class SummarySerializer(ModelSerializer):
    class Meta:
        model = Summary
        fields = ["id", "created_at", "content"]
        read_only_fields = ['created_at']

class AnalysisReportSerializer(ModelSerializer):
    results = AnalysisResultSerializer(many=True, read_only=True)
    latest_summary = SerializerMethodField()


    class Meta:
        model = AnalysisReport
        fields = ["id", "created_at", "results", "latest_summary"]
        read_only_fields = ['created_at']

    def get_latest_summary(self, obj):
        latest_summary = obj.summary.order_by('-created_at').first()
        if latest_summary:
            return SummarySerializer(latest_summary).data
        return None