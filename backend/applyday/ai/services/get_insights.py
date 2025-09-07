
from application.models import ResumeText
from report.models import AnalysisReport, Summary
from ai.chain.chain_insights import run_analysis, chain_analysis

def get_insights(report_id, resume_id=NotImplementedError, languages="en") -> str:
    # Analyze the resume data and extract insights 

    resume_qs = ResumeText.objects.filter(id=resume_id).first()
    resume_text = resume_qs.text if resume_qs else ""

    report_obj = AnalysisReport.objects.filter(id=report_id).prefetch_related("results").first()

    if not report_obj:
        raise ValueError(f"Report with id {report_id} does not exist.")
    
    market_data_parts = [f"- **{r.name}**: {r.result}" for r in report_obj.results.all()]
    market_data = "\n".join(market_data_parts)
    

    chain = chain_analysis()
    report_md = run_analysis(chain, market_data, resume_text, languages=languages)
    summary = Summary.objects.create(
        report=report_obj,
        content=report_md  
    )

    return summary.content