from analysis.tools.analyst import Analyst
from ..models import AnalysisReport, AnalysisResult

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
    def analyze(analyst: Analyst) -> dict:
        """Returns a dict of analysis results."""
        results = {}

        results["freq.role"] = dict(analyst.get_frequencies("role", text_mode=True).most_common(20))
        for choice in AnalysisService.freq_choices:
            results[f"freq.{choice}"] = dict(analyst.get_frequencies(choice, text_mode=False))

        results["pos.responsibilities"] = analyst.get_pos_tags_tokens("responsibilities")
        results["tfidf.skills"] = analyst.get_tfidf_skills()
        results["graph.skills"] = analyst.get_PMI_networks()
        results["swiss_knife"] = analyst.assess_swiss_knife_job()
        return results
    
    @staticmethod
    def generate_report(analyst: Analyst) -> AnalysisReport:
        """Generates and saves an AnalysisReport based on the provided Analyst."""
        analysis_results = AnalysisService.analyze(analyst)


        report = AnalysisReport.objects.create()
        objs = [
            AnalysisResult(report=report, name=k, result=v)
            for k, v in analysis_results.items()
        ]
        AnalysisResult.objects.bulk_create(objs)
        return report