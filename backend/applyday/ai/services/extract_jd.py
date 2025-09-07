import logging
from datetime import datetime

from application.models import JobDescriptionText, JobDescription
from ai.chain.chain_extraction import build_chain, extract_job_description
from ai.schema.jd_schema import JobSchema

logger = logging.getLogger(__name__)

def process_extract(job_ids=None, start=None, end=None):
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
        # 先检查数据库里是否已经有 JobDescription
        jd = JobDescription.objects.filter(job_text=job).first()
        if jd:
            print(f"⚡ 已存在 JobDescription，跳过抽取: {job.id}")
            results.append(jd)
            continue  # ⬅️ 跳过 LLM 抽取

        # 只有没有时才去跑 LLM
        obj: JobSchema = extract_job_description(chain, job.text)
        data = obj.model_dump()
        print("Extracted data:", data)

        jd = JobDescription.objects.create(job_text=job, **data)
        results.append(jd)

    return results
