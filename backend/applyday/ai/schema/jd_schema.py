# backend/applyday/ai/schema/jd_schema.py
# Author: Zhuang Xiaojian 

import re
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, field_validator

# Utility functions for normalization and validation
_WS = re.compile(r"\s+")
_MULTI_US = re.compile(r"_+")


def fuzzy_role_mapper(text: str) -> str:
    """Map various role descriptions to standardized role identifiers."""
    t = text.lower()
    if "react" in t or "flutter" in t:
        return "frontend"
    if "web" in t:
        return "fullstack"
    if "cloud" in t:
        return "cloud_engineer"
    if "mobile" in t:
        return "mobile_engineer"
    if "frontend" in t:
        return "frontend"
    elif "backend" in t or "back-end" in t:
        return "backend"
    elif "fullstack" in t or "full stack" in t:
        return "fullstack"
    elif "ml" in t or "machine learning" in t or "ai" in t or "artificial intelligence" in t or "data" in t:
        return "data_scientist"
    elif "qa" in t or "test" in t:
        return "qa_engineer"
    elif "devops" in t:
        return "devops"
    elif "software" in t or "application" in t or "sde" in t:
        return "software_engineer"
    return to_lower_snake(text)



def to_lower_snake(s: str) -> str:
    """Convert a string to lower_snake_case."""
    s = s.strip().lower()
    s = _WS.sub("_", s)
    s = s.replace("-", "_").replace("/", "_")
    s = _MULTI_US.sub("_", s)
    return s.strip("_")

def dedupe_sorted(items: List[str]) -> List[str]:
    """Dedupe and sort a list of strings, case-insensitively."""
    seen = {}
    for it in items:
        key = to_lower_snake(it)
        seen[key] = key
    return sorted(seen.values())

def to_bool_or_none(v):
    """Convert various truthy/falsey inputs to boolean or None."""
    if v in (None, "", "null"):
        return None
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        return bool(v)
    if isinstance(v, str):
        s = v.strip().lower()
        if s in {"true", "yes", "y", "1"}:
            return True
        if s in {"false", "no", "n", "0"}:
            return False
    return None

# Define which fields are arrays for normalization
ARRAY_FIELDS = [
    "benefits","responsibilities","required_core_skills","desirable_skills",
    "programming_languages","frameworks_tools","databases","cloud_platforms",
    "api_protocols","methodologies","mobile_technologies","domain_keywords",
    "language_requirements",
]
LEVEL_MAP = {
    "entry-level": "junior",
    "graduate": "junior",
    "sr": "senior",
    "senior-level": "senior",
    "team lead": "lead",
}

class JobSchema(BaseModel):
    """
    Pydantic model for structured job description data.
    Includes normalization and validation logic.
    """
    company: Optional[str] = None
    role: Optional[str] = None
    level: Optional[Literal["intern","junior","mid","senior","lead","manager"]] = None
    location: Optional[str] = None
    employment_type: Optional[Literal["full_time","contract","internship","part_time"]] = None
    salary_eur_min: Optional[float] = None
    salary_eur_max: Optional[float] = None
    bonus_percent: Optional[float] = None
    benefits: List[str] = Field(default_factory=list)
    years_experience_min: Optional[int] = None
    years_experience_max: Optional[int] = None
    education_required: Optional[str] = None
    responsibilities: List[str] = Field(default_factory=list)
    required_core_skills: List[str] = Field(default_factory=list)
    desirable_skills: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    frameworks_tools: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud_platforms: List[str] = Field(default_factory=list)
    api_protocols: List[str] = Field(default_factory=list)
    methodologies: List[str] = Field(default_factory=list)
    mobile_technologies: List[str] = Field(default_factory=list)
    domain_keywords: List[str] = Field(default_factory=list)
    remote_work: Optional[Literal["on-site","hybrid","remote"]] = None
    work_permit_required: Optional[bool] = None
    visa_sponsorship: Optional[bool] = None
    contact_person: Optional[str] = None
    contact_email_or_phone: Optional[str] = None
    industry: Optional[str] = None
    language_requirements: List[str] = Field(default_factory=list)

    @field_validator(
        "company","role","location","education_required",
        "contact_person","contact_email_or_phone",
        mode="before"
    )
    
    @classmethod
    def _strip_text(cls, v):
        """Strip leading/trailing whitespace; convert empty to None."""
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            return v if v else None
        return v

    @field_validator("industry", mode="before")
    @classmethod
    def _norm_industry(cls, v):
        """Normalize industry to lower_snake_case or None."""
        if v is None:
            return None
        if isinstance(v, str):
            s = to_lower_snake(v)
            return s if s else None
        return v
    
    @field_validator("location", mode="before")
    @classmethod
    def _norm_location(cls, v):
        """Normalize location to 'City, Country' format if possible.""" 
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            # Ensure single spaces, title case
            v = re.sub(r"\s+", " ", v).title()
            if "," in v:
                parts = [p.strip() for p in v.split(",") if p.strip()]
                return ", ".join(parts)
            return v
        return v

    @field_validator("level", mode="before")
    @classmethod
    def _norm_level(cls, v):
        """Normalize level to one of the allowed literals or None."""
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip().lower()
            return LEVEL_MAP.get(v, v)  # fallback to original
        return v
    
    @field_validator("role", mode="before")
    @classmethod
    def _normalize_role(cls, v):
        """Normalize role to standardized identifiers using fuzzy mapping."""
        if v is None:
            return None
        return fuzzy_role_mapper(v)

    @field_validator("work_permit_required","visa_sponsorship", mode="before")
    @classmethod
    def _to_bool(cls, v):
        """Convert various truthy/falsey inputs to boolean or None."""
        return to_bool_or_none(v)

    @field_validator("salary_eur_min","salary_eur_max","bonus_percent", mode="before")
    @classmethod
    def _to_float_or_none(cls, v):
        """Convert to float or None."""
        if v in (None, "", "null"):
            return None
        try:
            return float(v)
        except Exception:
            return None

    # ---- ints: to int or None
    @field_validator("years_experience_min","years_experience_max", mode="before")
    @classmethod
    def _to_int_or_none(cls, v):
        """Convert to int or None."""
        if v in (None, "", "null"):
            return None
        try:
            return int(v)
        except Exception:
            return None

    # ---- array fields: ensure list + normalize + dedupe + sort
    @field_validator(*ARRAY_FIELDS, mode="before")
    @classmethod
    def _normalize_array(cls, v):
        """Ensure field is a list of normalized, deduped, sorted strings."""
        if v is None:
            return []
        if isinstance(v, str):
            v = [v]
        out: List[str] = []
        for x in v:
            if isinstance(x, str):
                x = to_lower_snake(x)
                if x:
                    out.append(x)
        return dedupe_sorted(out)
