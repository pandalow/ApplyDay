import math
import string
import spacy
import pandas as pd
import numpy as np
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from itertools import combinations
from typing import List, Dict


class Analyst:
    def __init__(self, data):
        self.df = pd.DataFrame(data)

        # spaCy 加载
        self.nlp = spacy.load("en_core_web_sm", disable=["ner"]) 

        # 停用词 & 标点
        self.punct_set = set(string.punctuation) | {"’", "”", "“", "‘", "–", "—", "…"}
        extra_stopwords = {
            "or", "in", "a", "with", "from", "an", "other", "such", "as", "to", "for", "on", "of", "and", "and/or",
            "s", "/", "-",
            "recent", "recently", "currently", "first", "high", "preferred", "similar", "relevant",
            "equivalent", "related",
            "degree", "field", "fields", "discipline", "subjects", "courses", "majors", "work", "experience"
        }
        self.stopwords = self.nlp.Defaults.stop_words | extra_stopwords | self.punct_set

    # --- POS tagging ---
    def get_pos_tags_tokens(self, column: str) -> dict:
        texts = self.df[column].dropna().tolist()
        if not texts:
            return {"all": [], "verbs": [], "nouns": [], "adjectives": []}

        all_tokens, verbs, nouns, adjectives = [], [], [], []
        for item in texts:
            text = " ".join(item) if isinstance(item, list) else str(item)
            doc = self.nlp(text.replace("_", " "))
            for token in doc:
                if token.is_stop or token.is_punct or token.text.lower() in self.stopwords:
                    continue
                lemma = token.lemma_.lower()
                all_tokens.append(lemma)
                if token.pos_ == "VERB":
                    verbs.append(lemma)
                elif token.pos_ == "NOUN":
                    nouns.append(lemma)
                elif token.pos_ == "ADJ":
                    adjectives.append(lemma)

        return {"all": dict(Counter(all_tokens)), 
                "verbs": dict(Counter(verbs)), 
                "nouns": dict(Counter(nouns)), 
                "adjectives": dict(Counter(adjectives))}

    # --- Frequency statistics ---
    def get_frequencies(self, column: str, text_mode=False) -> Counter:
        items = self.df[column].dropna().tolist()
        if not items:
            return Counter()

        if isinstance(items[0], list):  # 技能字段
            return Counter([str(x).lower() for sublist in items for x in sublist])

        if text_mode:  # 自由文本
            tokens = []
            for text in items:
                doc = self.nlp(str(text).lower())
                tokens.extend([
                    t.lemma_ for t in doc
                    if not t.is_stop and not t.is_punct and t.text not in self.stopwords
                ])
            return Counter(tokens)

        return Counter([str(x).lower() for x in items if isinstance(x, str)])

    # --- Numeric distribution ---
    def get_number_frequencies(self, columns) -> dict:
        if isinstance(columns, str):
            return self.df[columns].value_counts().to_dict()
        else:
            return {col: self.df[col].value_counts().to_dict() for col in columns if col in self.df.columns}

    # --- TF-IDF skills ---
    def get_tfidf_skills(self, top_k: int = 10) -> Dict[str, List[Dict[str, float]]]:
        match_data = defaultdict(lambda: {
            "programming_languages": [],
            "frameworks_tools": [],
            "cloud_platforms": [],
            "databases": [],
            "api_protocols": [],
            "methodologies": []
        })

        # 收集 role 对应的技能
        for _, row in self.df.iterrows():
            r = row["role"]
            if pd.isna(r):
                continue
            match_data[r]["programming_languages"].extend(row["programming_languages"])
            match_data[r]["frameworks_tools"].extend(row["frameworks_tools"])
            match_data[r]["cloud_platforms"].extend(row["cloud_platforms"])
            match_data[r]["databases"].extend(row["databases"])
            match_data[r]["api_protocols"].extend(row["api_protocols"])
            match_data[r]["methodologies"].extend(row["methodologies"])

        role_docs = {}
        for role, fields in match_data.items():
            all_skills = []
            for skill_list in fields.values():
                all_skills.extend(skill_list)

            # spaCy 清洗
            doc = self.nlp(" ".join(all_skills).lower())
            clean_tokens = [
                t.lemma_ for t in doc
                if not t.is_stop and not t.is_punct and t.text not in self.stopwords
            ]
            role_docs[role] = " ".join(clean_tokens)

        roles = list(role_docs.keys())
        docs = list(role_docs.values())

        if not any(d.strip() for d in docs):
            return {}

        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(docs)
        feature_names = vectorizer.get_feature_names_out()

        role_top_skills = {}
        for i, role in enumerate(roles):
            row = X[i].toarray()[0]
            top_indices = np.argsort(row)[::-1][:top_k]
            role_top_skills[role] = [
                {"skill": feature_names[j], "score": float(row[j])}
                for j in top_indices if row[j] > 0
            ]
        return role_top_skills

    # --- PMI skill networks ---
    def get_PMI_networks(self, min_cofreq: int = 2) -> List[Dict]:
        job_skills_list = []
        for _, row in self.df.iterrows():
            skills = (
                row["programming_languages"]
                + row["frameworks_tools"]
                + row["cloud_platforms"]
                + row["databases"]
                + row["api_protocols"]
                + row["methodologies"]
            )
            # spaCy 清洗技能
            doc = self.nlp(" ".join(skills).lower())
            clean_skills = [
                t.lemma_ for t in doc
                if not t.is_stop and not t.is_punct and t.text not in self.stopwords
            ]
            job_skills_list.append(clean_skills)

        skill_freq = Counter()
        pair_freq = Counter()
        total_docs = len(job_skills_list)

        pmi_scores = {}
        for skill_list in job_skills_list:
            skills = set(skill_list)  # 去重
            for s in skills:
                skill_freq[s] += 1
            for s1, s2 in combinations(sorted(skills), 2):
                pair_freq[(s1, s2)] += 1

        for (s1, s2), co_freq in pair_freq.items():
            p_x = skill_freq[s1] / total_docs
            p_y = skill_freq[s2] / total_docs
            p_xy = co_freq / total_docs
            if p_xy > 0 and p_x > 0 and p_y > 0:
                pmi = math.log2(p_xy / (p_x * p_y))
                pmi_scores[(s1, s2)] = pmi

        pmi_filtered = {
            (s1, s2): pmi
            for (s1, s2), pmi in pmi_scores.items()
            if pair_freq[(s1, s2)] >= min_cofreq and pmi > 0
        }

        return [
            {"source": s1, "target": s2, "weight": pmi}
            for (s1, s2), pmi in pmi_filtered.items()
        ]

    # --- Swiss Knife JD assessment ---
    def assess_swiss_knife_job(self):
        def count_action_verbs(responsibilities: List[str]) -> int:
            text = " ".join(r.replace("_", " ") for r in responsibilities)
            doc = self.nlp(text)
            return sum(1 for token in doc if token.pos_ == "VERB")

        results = []
        for idx, row in self.df.iterrows():
            skills = (
                row["programming_languages"]
                + row["frameworks_tools"]
                + row["cloud_platforms"]
                + row["databases"]
                + row["api_protocols"]
                + row["methodologies"]
            )
            num_skills = len(set(skills))
            num_verbs = count_action_verbs(row["responsibilities"])
            odi = round(num_skills / num_verbs, 2) if num_verbs > 0 else None

            results.append({
                "index": int(idx),
                "role": row.get("role"),
                "company": row.get("company"),
                "odi_tools": odi,
                "is_swiss_jd": bool(odi and odi > 1.0)
            })
        return results
