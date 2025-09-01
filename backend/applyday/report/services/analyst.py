import math
import string
import spacy
import nltk
import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize
from collections import Counter, defaultdict
from nltk import pos_tag
from nltk.corpus import stopwords
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from itertools import combinations
import networkx as nx


nltk.download('punkt',quiet=True)
nltk.download("punkt_tab",quiet=True)
nltk.download("averaged_perceptron_tagger",quiet=True)
nltk.download('stopwords',quiet=True)

class Analyst:
    # Initialize the Analyst with data
    def __init__(self, data):
        
        self.punct_set = set(string.punctuation)   # !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
        extra = {"’", "”", "“", "‘", "–", "—", "…"}  # Normalize some common special punctuation
        extra_stopwords = {
        "or","in","a","with","from","an","other","such","as","to","for","on","of","and","and/or",
        "s","/","-",
        "recent","recently","currently","first","high","preferred","similar","relevant",
        "equivalent","related",
          "degree","field","fields","discipline","subjects","courses","majors","work","experience"
        }
        self.punct_set = self.punct_set | extra
        self.stopwords = set(stopwords.words('english')) | extra_stopwords
        self.nlp = spacy.load("en_core_web_sm")

        self.df = pd.DataFrame(data)


    def get_pos_tags_tokens(self, columns:str) -> dict:
        """
        Get part-of-speech tags from a list of text data.
        Args:
            columns (str): The column name to analyze.
        Returns:
            dict: A dictionary with keys 'all', 'verbs', 'nouns', 'adjectives' and their corresponding token lists.
        """

        texts = self.df[columns].dropna().tolist()
        if not texts:
            return {"all": [], "verbs": [], "nouns": [], "adjectives": []}
        
        responses = []
        for item in texts:
            for sentences in item:
                sentences = sentences.replace("_", " ")
                responses.append(word_tokenize(sentences))

        tokens = []
        for i in responses:
            tokens.extend(i)

        
        tagged_words = pos_tag(tokens)
        filtered = [(word, pos) for word, pos in tagged_words if word.lower() not in self.stopwords and word not in self.punct_set]


        verbs = [word for word, pos in filtered if pos.startswith('VB')]
        nouns = [word for word, pos in filtered if pos.startswith('NN')]
        adjectives = [word for word, pos in filtered if pos.startswith('JJ')]

        return {
            "all": [word.lower() for word, pos in filtered],
            "verbs": verbs,
            "nouns": nouns,
            "adjectives": adjectives
        }

    def get_frequencies(self, column:str, text_mode=False) -> Counter:
        """
        Get a Counter object for a given column.
        Args:
            column (str): The column name to analyze.
            text_mode (bool): Whether to treat the column as free text for tokenization.
        Returns:
            Counter: A Counter object with item frequencies.
        """

        items = self.df[column].dropna().tolist()

        if not items:
            return Counter()

        # List column (like programming_languages, frameworks_tools, databases, cloud_platforms, api_protocols, methodologies, mobile_technologies)
        if isinstance(items[0], list):
            items = [str(item).lower() for sublist in items for item in sublist]
            return Counter(items)
        # Text column (like responsibilities, required_core_skills, desirable_skills)
        if text_mode:
            tokens = []
            for text in items:
                if isinstance(text, str):
                    tokens.extend(word_tokenize(text.lower()))
            tokens = [w for w in tokens if w not in self.punct_set and w not in self.stopwords]
            return Counter(tokens)
        
        # fallback: Normal column (like location, role, education_required)
        return Counter([str(x).lower() for x in items if isinstance(x, str)])

    # --- Distribution of numerics ---
    def get_number_frequencies(self, columns) -> dict:
        """
        Get statistics for numeric columns.
        """
        if isinstance(columns, str):
            return self.df[columns].value_counts().to_dict()
        else:
            return {col: self.df[col].value_counts().to_dict() for col in columns if col in self.df.columns}


    def get_tfidf_skills(self):
        match_data = defaultdict(lambda: {
            "programming_languages": [],
            "frameworks_tools": [],
            "cloud_platforms": [],
            "databases":[],
            "api_protocols":[],
            "methodologies": []
        })

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
            skill_text = " ".join(all_skills)  # 词袋字符串
            role_docs[role] = skill_text

        roles = list(role_docs.keys())
        docs = list(role_docs.values())

        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(docs)  # shape: (num_roles, num_skills)

        feature_names = vectorizer.get_feature_names_out()

        top_k = 10
        role_top_skills = {}

        for i, role in enumerate(roles):
            row = X[i].toarray()[0]  # index i's TF-IDF vector
            top_indices = np.argsort(row)[::-1][:top_k]
            top_skills = [(feature_names[j], row[j]) for j in top_indices if row[j] > 0]
            role_top_skills[role] = top_skills

        return role_top_skills



    def get_PMI_networks(self):

        job_skills_list = []
        for _, row in self.df.iterrows():
            skills = []
            skills.extend(row["programming_languages"])
            skills.extend(row["frameworks_tools"])
            skills.extend(row["cloud_platforms"])
            skills.extend(row["databases"])
            skills.extend(row["api_protocols"])
            skills.extend(row["methodologies"])
            job_skills_list.append(skills)

        skill_freq = Counter()
        pair_freq = Counter()
        total_docs = len(job_skills_list)

        for skill_list in job_skills_list:
            skills = set(skill_list)  # 去重，只考虑“是否出现”
            for s in skills:
                skill_freq[s] += 1
            for s1, s2 in combinations(sorted(skills), 2):  # 排序 + 两两组合
                pair_freq[(s1, s2)] += 1

            pmi_scores = {}

            for (s1, s2), co_freq in pair_freq.items():
                p_x = skill_freq[s1] / total_docs
                p_y = skill_freq[s2] / total_docs
                p_xy = co_freq / total_docs

                if p_xy > 0 and p_x > 0 and p_y > 0:
                    pmi = math.log2(p_xy / (p_x * p_y))
                    pmi_scores[(s1, s2)] = pmi

        MIN_COFREQ = 3
        pmi_filtered = {
            (s1, s2): pmi
            for (s1, s2), pmi in pmi_scores.items()
            if pair_freq[(s1, s2)] >= MIN_COFREQ and pmi > 0
        }
        G = nx.Graph()

        for (s1, s2), pmi in pmi_filtered.items():
            G.add_edge(s1, s2, weight=pmi)
            
        return G

    def assess_swiss_knife_job(self):

        def count_action_verbs(responsibilities: List[str]) -> int:
            text = " ".join(r.replace("_", " ") for r in responsibilities)
            doc = self.nlp(text)
            return sum(1 for token in doc if token.pos_ == "VERB")

        def compute_odi_tools(row):
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
            if num_verbs == 0:
                return None
            return round(num_skills / num_verbs, 2)

        odi_tools = self.df.apply(compute_odi_tools, axis=1)
        is_swiss_jd = self.df["ODI_tools"].apply(lambda x: x > 1.0 if pd.notna(x) else False)

        return {
            "odi_tools": odi_tools,
            "is_swiss_jd":is_swiss_jd
        }