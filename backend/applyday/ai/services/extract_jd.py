#backend/applyday/ai/services/extract_jd.py
# Author: Zhuang Xiaojian 
import logging
from datetime import datetime

from application.models import JobDescriptionText, JobDescription
from ai.chain.chain_extraction import build_chain, extract_job_description
from ai.schema.jd_schema import JobSchema

logger = logging.getLogger(__name__)

def process_extract(job_ids=None, start=None, end=None):
    """
    Process job description extraction for given job IDs or date range.
    If no parameters are provided, process all JobDescriptionText entries.
    Args:
        job_ids (list of int, optional): List of JobDescriptionText IDs to process.
        start (str, optional): Start date in ISO format (YYYY-MM-DD).
        end (str, optional): End date in ISO format (YYYY-MM-DD).
    Returns:
        list of JobDescription: Created JobDescription instances.
    """
    qs = JobDescriptionText.objects.all()

    if job_ids:
        qs = qs.filter(id__in=job_ids)
    elif start and end:
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end)
        qs = qs.filter(created_at__range=[start_dt, end_dt])
    
    chain = build_chain()
    results = []

    for job in qs:
        # Check JobDescription
        jd = JobDescription.objects.filter(job_text=job).first()
        if jd:
            print(f"JobDescription exists, skipping extraction: {job.id}")
            results.append(jd)
            continue  # Skip LLM extraction

        # Only run LLM if not exists
        obj: JobSchema = extract_job_description(chain, job.text)
        data = obj.model_dump()
        print("Extracted data:", data)

        jd = JobDescription.objects.create(job_text=job, **data)
        results.append(jd)

    return results
