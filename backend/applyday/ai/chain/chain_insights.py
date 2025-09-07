from langchain.prompts import PromptTemplate
import logging
import traceback
from ai.factory import get_llm

logger = logging.getLogger(__name__)

def chain_analysis():
    """Chain for market analysis + resume comparison"""
    try:

        prompt = PromptTemplate(
            template=(
                """
                You are a professional job market insights analyst. 
                Your role is to analyze structured market data (frequency stats, TF-IDF skills, skill co-occurrence networks, and Swiss-Knife JD scores), 
                and optionally compare it against a candidate resume to produce a **concise, practical insights report**. 

                ## Input Data
                ### Market Data
                {data}

                ### Candidate Resume (may be empty if not provided)
                {resume_text}

                ### Analysis Tasks
                1. **Must-Have Skills**
                - From frequency results (freq.programming_languages, freq.frameworks_tools, freq.cloud_platforms, freq.databases), 
                    identify the top recurring skills that appear most often across jobs.
                - List them clearly as “must-learn” core skills.

                2. **Differentiating Skills**
                - From TF-IDF (tfidf.skills), extract the top distinctive skills per role.
                - Explain why these skills matter for specialization.

                3. **Skill Synergies**
                - From graph.skills (co-occurrence network), highlight the strongest skill pairs or clusters.
                - Suggest how a candidate could learn them together as a bundle.

                4. **Swiss-Knife JD Check**
                - From swiss_knife results, identify if there are jobs with high ODI (overloaded JD with too many skills).
                - Give advice on how to recognize and handle such postings.

                5. **Candidate Fit Analysis (only if resume is provided)**
                - Compare the candidate’s skills and experiences against the identified must-have and differentiating skills.
                - Highlight strengths (skills the candidate already has that align with market demand).
                - Highlight gaps (missing must-have or differentiating skills).
                - Suggest tailored development directions based on these gaps.

                6. **Action Plan**
                - Provide exactly **3 realistic, actionable tasks** the candidate can do in the next 1–2 months 
                    to improve their competitiveness.
                - Tasks should be specific (e.g., “Take an online Python + SQL mini-project”, “Get AWS Cloud Practitioner certification”).

                ### Output Requirements
                - Respond in **Markdown format**.
                - Use clear sections with `##` headings:
                - Must-Have Skills
                - Differentiating Skills
                - Skill Synergies
                - Swiss-Knife JD Analysis
                - Candidate Fit Analysis (only if resume provided)
                - 3-Step Action Plan
                - Be concise, insightful, and practical.
                - ⚠️ Respond exclusively in {languages}.
                """
            ),
            input_variables=["data", "resume_text", "languages"],
        )
        model = get_llm()
        chain = prompt | model 
        logger.info("✅ Analysis chain constructed.\n")
        return chain
    except Exception as e:
        logger.error("❌ Chain construct error: %s", repr(e))
        traceback.print_exc()
        raise RuntimeError(f"Failed to construct analysis chain: {e}")


def run_analysis(chain, data, resume_text=None, languages="en") -> str:
    """Invoke the analysis chain"""
    try:
        language_map = {
            "en": "English",
            "zh": "Chinese (中文)",
            "english": "English",
            "chinese": "Chinese (中文)"
        }
        
        # 安全处理 languages 参数
        safe_languages = languages or "en"
        if not isinstance(safe_languages, str):
            safe_languages = str(safe_languages)
        
        normalized_language = language_map.get(safe_languages.lower(), "English")
        
        response = chain.invoke({
            "data": data,
            "resume_text": resume_text or "",
            "languages": normalized_language
        })
        logger.info("✅ Analysis invoke OK.")
        
        if response and hasattr(response, "content"):
            return response.content
        return str(response)
    except Exception as e:
        logger.error("❌ Analysis invoke error: %s", repr(e))
        traceback.print_exc()
        raise RuntimeError(f"Failed to run analysis: {e}")
