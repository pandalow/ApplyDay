# batch_extract_debug.py
import os, glob, json, sys, traceback
from pathlib import Path
import logging

from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from backend.applyday.extract.schema import JobSchema

logger = logging.getLogger(__name__)
load_dotenv()  # Reading env


def build_chain() -> str:

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
    except Exception as e:
        logger.error("❌ Chain construct error:", repr(e))
        traceback.print_exc()
    sys.exit(1)

    return chain


def extract_job_description(chain, jd_text:str) -> JobSchema:
    try:
        one = chain.invoke({"jd_text": jd_text})
        logger.info("✅ Single invoke OK. Sample output keys:", list(one.dict().keys())[:5], "...\n")
    except Exception as e:
        logger.error("❌ Single invoke error:", repr(e))
        traceback.print_exc()
        sys.exit(1)
    return one


ok, fail = 0, 0
for p in paths:
    try:
        with open(p, "r", encoding="utf-8") as f:
            txt = f.read()
        chain = build_chain()
        obj: JobSchema = extract_job_description(chain, txt)
        out_file = out_dir / (Path(p).stem + ".json")


