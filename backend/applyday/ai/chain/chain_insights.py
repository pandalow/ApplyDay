# backend/applyday/ai/chain/chain_insights.py
# Author: Zhuang Xiaojian

import logging, traceback
from langchain.prompts import PromptTemplate

from ai.factory import get_llm

logger = logging.getLogger(__name__)

def chain_analysis():
    """
    Chain for market analysis + resume comparison
    1. Input structured market data + optional resume text
    2. Output concise, practical insights report in markdown
    3. Focus on actionable advice grounded in real projects/experience
    4. Respond in specified language (English or Chinese)
    """
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

                ## Analysis Tasks
                0. **Executive Summary**
                - Start with a short summary (3–4 sentences) highlighting key market trends and the candidate’s overall alignment.

                1. **Must-Have Skills**
                - Identify top recurring skills from frequency results (programming_languages, frameworks_tools, cloud_platforms, databases).
                - List them as must-learn core skills.

                2. **Differentiating Skills**
                - Extract top distinctive skills per role from TF-IDF.
                - Explain why these skills matter for specialization.

                3. **Skill Synergies**
                - From skill co-occurrence graph, highlight strongest skill pairs/clusters.
                - Suggest how to learn them together.

                4. **Swiss-Knife JD Check**
                - Identify overloaded JDs (high ODI) and give advice on recognizing/handling them.

                5. **Candidate Fit Analysis (only if resume provided)**
                - Compare candidate’s skills and experiences against must-have/differentiating skills.
                - Focus on practical evidence (work experience, projects, tangible outcomes), not just listed keywords.
                - Highlight strengths and gaps.
                - Suggest tailored directions grounded in past projects.

                6. **Action Plan**
                - Provide exactly 3 realistic, actionable tasks for the next 1–2 months.
                - Each task should build on existing work/project experience (e.g., extend a project with SQL optimization, add AWS deployment, integrate CI/CD), not generic courses.

                ## Output Requirements
                - Respond in Markdown format directly (no code blocks).
                - Use clear `##` headings:
                - Executive Summary
                - Must-Have Skills
                - Differentiating Skills
                - Skill Synergies
                - Swiss-Knife JD Analysis
                - Candidate Fit Analysis (only if resume provided)
                - 3-Step Action Plan
                - Be concise, insightful, and practical.
                - ⚠️ Respond exclusively in {languages}.
                - ⚠️ Do NOT wrap response in ```markdown``` code blocks.
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
        # normalize language input
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
        
        # Extract content from response
        if response and hasattr(response, "content"):
            content = response.content
        else:
            content = str(response)
        
        # Clean up markdown code block wrappers if present
        if content.startswith("```markdown\n") and content.endswith("\n```"):
            content = content[12:-4]  # Remove ```markdown\n and \n```
        elif content.startswith("```\n") and content.endswith("\n```"):
            content = content[4:-4]  # Remove ```\n and \n```

        return content
    except Exception as e:
        logger.error("❌ Analysis invoke error: %s", repr(e))
        traceback.print_exc()
        raise RuntimeError(f"Failed to run analysis: {e}")
