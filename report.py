import json
import glob
from collections import Counter
from draw_charts import Drawer
from backend.applyday.report.services.analyst import Analyst
from choices.report_choices import wob_columns,numbers_columns,tokenized_columns,distribute_columns

def load_all_json(folder_path):
    data = []
    for file_path in glob.glob(f"{folder_path}/*.json"):
        with open(file_path, 'r', encoding='utf-8') as f:
            file_data = json.load(f)
            data.append(file_data)
    return data

data = load_all_json('outputs/json')

ana = Analyst(data)
drawer = Drawer()

roles = dict(ana.get_frequencies("role", text_mode=True).most_common(20))
drawer.draw_bar_chart(roles, title="Role Frequencies", xlabel="Roles", ylabel="Counts", filename="01_roles.png")

level = ana.get_frequencies("level",text_mode=False)
drawer.draw_circle_chart(level, title="Distribution of level", filename="02_levels.png")

locations = ana.get_frequencies('location', text_mode=True)
drawer.draw_bar_chart(locations,title="Locations",xlabel="locations",ylabel="Counts",filename="03_locations")

languages = ana.get_frequencies('programming_languages', text_mode=False)
drawer.draw_bar_chart(languages, title="Programming languages", xlabel="languages", ylabel="Counts", filename="04_languages.png")

frameworks = ana.get_frequencies('frameworks_tools', text_mode=False)
top10_frameworks = dict(frameworks.most_common(10))
drawer.draw_bar_chart(frameworks, title="Frameworks & Tools", xlabel="frameworks & tools", ylabel="Counts", filename="05_frameworks_tools.png")

clouds = ana.get_frequencies('cloud_platforms', text_mode=False)
drawer.draw_circle_chart(clouds, title="Cloud Platforms", filename="06_clouds.png")

# Word Clouds for WOB columns
responsibilities = ana.get_pos_tags_tokens("responsibilities")
drawer.draw_wordcloud(Counter(responsibilities['verbs']), filename="07_verbs.png")
drawer.draw_wordcloud(Counter(responsibilities['nouns']), filename="08_nouns.png")
drawer.draw_wordcloud(Counter(responsibilities['adjectives']), filename="09_adjectives.png")

databases = ana.get_frequencies('databases', text_mode=False)
drawer.draw_bar_chart(databases, title="Databases", xlabel="databases", ylabel="Counts", filename="14_databases.png")

employment_types = ana.get_frequencies('employment_type', text_mode=False)
drawer.draw_circle_chart(employment_types, title="Employment Types", filename="15_employment_types.png")

results = {
    "roles": roles,
    "levels": level,
    "locations": locations,
    "languages": languages,
    "frameworks": top10_frameworks,
    "clouds": clouds,
    "databases": databases,
    "employment_types": employment_types,
    "responsibilities_verbs": Counter(responsibilities['verbs']),
    "responsibilities_nouns": Counter(responsibilities['nouns']),
    "responsibilities_adjectives": Counter(responsibilities['adjectives']),
}

json_output = json.dumps(results, indent=4)
with open('charts/report.json', 'w', encoding='utf-8') as f:
    f.write(json_output)