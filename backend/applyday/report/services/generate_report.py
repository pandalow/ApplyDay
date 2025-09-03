from .analyst import Analyst
from ..models import AnalysisReport, AnalysisResult, JobDescription

class AnalysisService:
    freq_choices = [
        'level',
        'location',
        'programming_languages',
        'frameworks_tools',
        'cloud_platforms',
        'databases',
        'employment_type',
    ]

    @staticmethod
    def generate_report(analyst: Analyst):
        report  = AnalysisReport.objects.create()

        results = []
        roles = dict(analyst.get_frequencies("role", text_mode=True).most_common(20))
        results.append(
            AnalysisResult(report=report, name="freq.role", result=roles)
        )
        # Dynamically get frequencies for all freq_choices
        for choice in AnalysisService.freq_choices:
            results.append(
                AnalysisResult(report=report, 
                               name=f"freq.{choice}", 
                               result=dict(analyst.get_frequencies(
                                   choice, 
                                   text_mode=False
                                   ))))

        # Responsibilities pos_tag with phrases
        responsibilities = analyst.get_pos_tags_tokens("responsibilities")
        results.append(
            AnalysisResult(report=report, name="pos.responsibilities", result=responsibilities)
        )

        role_top_skills = analyst.get_tfidf_skills()
        results.append(
            AnalysisResult(report=report, name="tfidf.skills", result=role_top_skills)
        )

        skills_PMI = analyst.get_PMI_networks()
        results.append(
            AnalysisResult(report=report, name="graph.skills", result=skills_PMI)
        )

        swiss_knife = analyst.assess_swiss_knife_job()
        results.append(
            AnalysisResult(report=report, name="swiss_knife", result=swiss_knife)
        )
        AnalysisResult.objects.bulk_create(results)

        return report