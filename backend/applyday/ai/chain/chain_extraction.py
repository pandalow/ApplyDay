# ai/chain/jd_extract_chain.py
# Build a LangChain chain to extract job description info using LLMs
import logging
import sys, traceback
from typing import Optional
from dotenv import load_dotenv
load_dotenv() # Load environment variables from .env file

from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser

from ai.schema.jd_schema import JobSchema
from ai.factory import get_llm

logger = logging.getLogger(__name__)


def build_chain():
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

        model = get_llm()
        chain = prompt | model | parser
        logger.info("✅ Chain constructed.\n")
        return chain
    except Exception as e:
        logger.error("❌ Chain construct error: %s", repr(e))
        traceback.print_exc()
        sys.exit(1)

def extract_job_description(chain, jd_text:Optional[str]) -> JobSchema:
    try:
        one = chain.invoke({"jd_text": jd_text})
        logger.info("✅ Single invoke OK. Sample output keys: %s", list(one.dict().keys())[:5])
        return one
    except Exception as e:
        logger.error("❌ Single invoke error: %s", repr(e))
        traceback.print_exc()
        sys.exit(1)

