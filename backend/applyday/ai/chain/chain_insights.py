from langchain.prompts import PromptTemplate
import logging
import sys, traceback
from ai.factory import get_llm

logger = logging.getLogger(__name__)

def chain_analysis():
    """Chain for market analysis + resume comparison"""
    try:
        prompt = PromptTemplate(
                      template=(
                "You are a senior job market analyst. Based on the following input, generate a professional **Markdown-formatted** market analysis report.\n\n"
                "Input:\n"
                "## Market Job Data\n{data}\n\n"
                "## Candidate Resume Information\n{resume_text}\n\n"
                "### Analysis tasks:\n"
                "1. If resume information is provided:\n"
                "   - Summarize the core requirements of the market positions (skills, experience, qualifications, etc.).\n"
                "   - Compare the candidate’s resume against these requirements, identifying strengths and areas of alignment.\n"
                "   - Highlight the candidate’s gaps or areas for improvement (skills, certifications, experiences that should be added).\n"
                "   - Provide concise, professional recommendations for career development.\n"
                "2. If no resume information is provided:\n"
                "   - Produce a market analysis summary based only on the job market data, including core skills in demand, emerging trends, and suggested development directions.\n\n"
                "### Output requirements:\n"
                "- Return the report as **well-structured Markdown**.\n"
                "- Use clear section headings (## or ###) for each part.\n"
                "- Write in a professional and analytical style.\n"
            ),
            input_variables=["data", "resume_text"],
        )

        model = get_llm()
        chain = prompt | model 
        logger.info("✅ Analysis chain constructed.\n")
        return chain
    except Exception as e:
        logger.error("❌ Chain construct error: %s", repr(e))
        traceback.print_exc()
        sys.exit(1)


def run_analysis(chain, data, resume_text=None) -> str:
    """Invoke the analysis chain"""
    try:
        response = chain.invoke({
            "data": data,
            "resume_text": resume_text or ""  
        })
        logger.info("✅ Analysis invoke OK.")
        
        if response and hasattr(response, "content"):
            return response.content
        return str(response)
    except Exception as e:
        logger.error("❌ Analysis invoke error: %s", repr(e))
        traceback.print_exc()
        sys.exit(1)
