#

from datetime import datetime
import os, sys, traceback
from pathlib import Path
import logging
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from .schema import JobSchema

from ..models import JobDescriptionText
from report.models import JobDescription


logger = logging.getLogger(__name__)
load_dotenv()  # Reading env


def build_chain():

    logger.info("=== Diagnostics ===")
    logger.info("OPENAI_API_KEY set: %s", bool(os.getenv("OPENAI_API_KEY")))
    logger.info("===================\n")
    try:
        parser = PydanticOutputParser(pydantic_object=JobSchema)
        prompt = PromptTemplate(
            template=(
                "You are an information extractor. Extract job information from the following JD.\n"
                "IMPORTANT rules:\n"
                "- For `level`, only use one of: intern, junior, mid, senior, lead, manager.\n"
                "- For `employment_type`, only use: full_time, contract, internship, part_time.\n"
                "- For `remote_work`, only use: on-site, hybrid, remote.\n"
                "- For `salary_eur_min` and `salary_eur_max`, output numeric values in euros (no units like k).\n"
                "- For `location`, if available, always format as 'City, Country'.\n"
                "- For skills/benefits lists, always return an array of strings.\n\n"
                "- For `location`, if available, format as 'City, Country' (e.g., 'Dublin, Ireland').\n"
                "{format_instructions}\n\n"
                "JD:\n{jd_text}"
            ),
            input_variables=["jd_text"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        chain = prompt | model | parser
        logger.info("✅ Chain constructed.\n")
        return chain
    except Exception as e:
        logger.error("❌ Chain construct error: %s", repr(e))
        traceback.print_exc()
        sys.exit(1)

def extract_job_description(chain, jd_text:str) -> JobSchema:
    try:
        one = chain.invoke({"jd_text": jd_text})
        logger.info("✅ Single invoke OK. Sample output keys: %s", list(one.dict().keys())[:5])
        return one
    except Exception as e:
        logger.error("❌ Single invoke error: %s", repr(e))
        traceback.print_exc()
        sys.exit(1)


def process_extract(start, end):
    qs = JobDescriptionText.objects.all()
    if start and end:
        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end)
        qs = qs.filter(created_at__range = [start_dt, end_dt])
    
    logger.info("Found %s job descriptions", qs.count())

    chain = build_chain()
    for job in qs:
        obj: JobSchema = extract_job_description(chain, job.text)

        data = obj.model_dump()
        jd = JobDescription.objects.create(**data)
