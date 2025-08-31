好 ✅ 我给你整理一些 **最常用的图形绘制代码示例**，用 **Matplotlib + Seaborn + WordCloud** 就能搞定。你只要把数据换成自己的就能跑。

---

## 1. 分类分布 → 条形图

适用：岗位角色、技能、学历等

```python
import seaborn as sns
import matplotlib.pyplot as plt

role_counts = {"Engineer": 11, "Developer": 6, "Analyst": 3, "Graduate": 3}
roles = list(role_counts.keys())
counts = list(role_counts.values())

plt.figure(figsize=(6,4))
sns.barplot(x=roles, y=counts)
plt.title("Role Distribution")
plt.ylabel("Count")
plt.show()
```

👉 如果类别太多，换成 **水平条形图**：

```python
sns.barplot(y=roles, x=counts)
```

---

## 2. 占比 → 饼图/环形图

适用：Remote vs Onsite、Full-time vs Part-time

```python
import matplotlib.pyplot as plt

employment_counts = {"Full-time": 20, "Internship": 5, "Contract": 3}

plt.figure(figsize=(5,5))
plt.pie(employment_counts.values(),
        labels=employment_counts.keys(),
        autopct="%1.1f%%", startangle=90)
plt.title("Employment Type Distribution")
plt.show()
```

👉 环形图（加一个 `circle`）：

```python
fig, ax = plt.subplots(figsize=(5,5))
wedges, texts, autotexts = ax.pie(employment_counts.values(),
                                  labels=employment_counts.keys(),
                                  autopct="%1.1f%%", startangle=90)
centre_circle = plt.Circle((0,0),0.70,fc='white')
fig.gca().add_artist(centre_circle)
plt.title("Employment Type (Donut Chart)")
plt.show()
```

---

## 3. 数值分布 → 直方图 / 箱型图

适用：薪资分布、工作年限

```python
import numpy as np
import seaborn as sns

salaries = np.random.randint(30000, 100000, size=100)

# 直方图
sns.histplot(salaries, bins=10, kde=True)
plt.title("Salary Distribution")
plt.show()

# 箱型图
sns.boxplot(x=salaries)
plt.title("Salary Boxplot")
plt.show()
```

---

## 4. 对比 → 分组柱状图 / 箱型图

适用：Remote vs Onsite 薪资对比、不同级别的平均薪资

```python
import pandas as pd

data = pd.DataFrame({
    "Salary":[40000, 45000, 80000, 90000, 70000, 75000],
    "Type":["Remote","Remote","Onsite","Onsite","Remote","Onsite"]
})

# 箱型图对比
sns.boxplot(x="Type", y="Salary", data=data)
plt.title("Remote vs Onsite Salary")
plt.show()

# 分组柱状图
avg_salary = data.groupby("Type")["Salary"].mean().reset_index()
sns.barplot(x="Type", y="Salary", data=avg_salary)
plt.title("Average Salary by Type")
plt.show()
```

---

## 5. 关键词 → 条形图 + 词云

适用：responsibilities 动词/名词统计、技能高频词

```python
from collections import Counter
from wordcloud import WordCloud

words = ["develop","develop","engineer","python","python","python","team","test","test"]
counter = Counter(words)


# 词云
wc = WordCloud(width=600, height=400, background_color="white")
wc.generate_from_frequencies(counter)

plt.figure(figsize=(8,6))
plt.imshow(wc, interpolation="bilinear")
plt.axis("off")
plt.show()
```

---

## 6. 地理信息 → 地图热力图

适用：岗位城市/国家分布

```python
import geopandas as gpd
import matplotlib.pyplot as plt

# 世界地图
world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))

# 简单示例：Ireland = 4, UK = 2, Italy = 1
data = {"Ireland":4,"United Kingdom":2,"Italy":1}
world["count"] = world["name"].map(data).fillna(0)

world.plot(column="count", cmap="Reds", legend=True, figsize=(10,6))
plt.title("Job Distribution by Country")
plt.show()
```

---

## ✅ 总结

* **分类分布** → 条形图（水平/垂直）
* **占比** → 饼图/环形图
* **数值分布** → 直方图 / 箱型图
* **对比** → 分组柱状图 / 箱型图
* **关键词** → 条形图 + 词云
* **地理信息** → 地图热力图

---

要不要我帮你写一个 **通用函数库**，比如 `plot_distribution(data, kind="bar")`，可以自动选择合适的 seaborn/matplotlib 图，而不用每次写重复代码？
