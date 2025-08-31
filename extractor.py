import os
import glob, json
from dotenv import load_dotenv
from pathlib import Path

from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser
from backend.applyday.extract.schema import JobSchema

load_dotenv()  

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

md_files = glob.glob("data/jds/*.md")
out_dir = Path("outputs")
out_dir.mkdir(exist_ok=True)

for md in md_files:
    with open(md, "r", encoding="utf-8") as f:
        jd_text = f.read()
    result: JobSchema = chain.invoke({"jd_text": jd_text})
    out_file = out_dir / (Path(md).stem + ".json")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(result.model_dump_json(indent=2))