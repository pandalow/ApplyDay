# backend/applyday/ai/factory.py
import os
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    """Factory function to get LLM instance based on environment variables."""
    provider = os.getenv("AI_PROVIDER", "openai").lower()
    model_name = os.getenv("AI_MODEL", "gpt-4o-mini")
    temperature = float(os.getenv("AI_TEMPERATURE", "0"))

    # Common timeout and retry settings for all providers
    request_timeout = 120  # 2 minutes timeout
    max_retries = 2

    if provider == "openai":
        return ChatOpenAI(
            model=model_name, 
            temperature=temperature,
            timeout=request_timeout,
            max_retries=max_retries
        )
    elif provider == "anthropic":
        return ChatAnthropic(
            model_name="claude-3-haiku", 
            temperature=0, 
            timeout=request_timeout, 
            max_retries=max_retries,
            stop=["\n\n"]
        )
    elif provider == "google":
        return ChatGoogleGenerativeAI(
            model=model_name, 
            temperature=temperature,
            request_timeout=request_timeout
        )
    else:
        raise ValueError(f"Unsupported AI provider: {provider}")
