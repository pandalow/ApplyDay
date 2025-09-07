import os
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    provider = os.getenv("AI_PROVIDER", "openai").lower()
    model_name = os.getenv("AI_MODEL", "gpt-4o-mini")
    temperature = float(os.getenv("AI_TEMPERATURE", "0"))


    if provider == "openai":
        return ChatOpenAI(model=model_name, temperature=temperature)
    elif provider == "anthropic":
        return ChatAnthropic(model_name="claude-3-haiku", temperature=0, timeout=60, stop=["\n\n"])
    elif provider == "google":
        return ChatGoogleGenerativeAI(model=model_name, temperature=temperature)
    else:
        raise ValueError(f"Unsupported AI provider: {provider}")
