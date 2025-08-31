👌 好的，我把前面聊到的 **基础维度 + 高级维度** 全部整理成一个 **完整统计清单**，你可以按步骤逐一完成。

---

# 📋 岗位数据统计分析清单

## 1. 岗位属性

* [x] **岗位角色/级别**：`role`, `level` 分布
* [x] **工作形式**：`location`（Remote/Onsite/Hybrid）、`employment_type`
* [x] **经验要求**：`years_experience_min/max` 分布（直方图/箱型图）
* [ ] **教育要求**：`education_required`（有要求 vs 无要求）

## 2. 薪资与待遇

* [ ] **薪资区间**：`salary_min/max` 分布（直方图/箱型图）
* [ ] **平均薪资 vs 岗位级别**（junior/mid/senior）
* [ ] **Remote vs Onsite 薪资对比**
* [ ] **奖金**：`bonus_percent` 出现比例
* [x] **福利**：`benefits` 高频统计（healthcare, pension, stock options, visa sponsorship 等）

## 3. 技能需求

* [ ] **核心技能 vs 可选技能**：`required_core_skills` vs `desirable_skills`
* [x] **编程语言分布**：`programming_languages`
* [x] **框架/工具分布**：`frameworks_tools`
* [x] **数据库**：`databases`（SQL vs NoSQL）
* [x] **云平台**：`cloud_platforms`（AWS, Azure, GCP）
* [x] **API 协议**：`api_protocols`（REST, GraphQL）
* [x] **方法论**：`methodologies`（Agile, Scrum, TDD）
* [x] **移动技术**：`mobile_technologies`（iOS, Android, React Native）

## 4. 岗位职责

* [x] **职责词频**：`responsibilities` 的动词/名词/形容词统计
* [ ] **职责模式聚类**：开发类、测试类、设计类、协作类

## 5. 招聘政策

* [x] **工作许可**：`work_permit_required`（是/否）
* [x] **签证赞助**：`visa_sponsorship`（提供 vs 不提供）
* [ ] **语言要求**：`language_requirements`（English, German, French…）

## 6. 公司与行业

* [ ] **行业分布**：`industry`（金融、医疗、教育、AI、游戏等）
* [ ] **岗位来源差异**：Remote vs Onsite 的行业差异
* [ ] **公司规模/知名度**（如果数据能补充）

---

# 🔹 高级分析维度

## 7. 相关性分析

* [ ] **薪资 vs 技能**（掌握某技能是否影响薪资）
* [ ] **薪资 vs 经验**（经验要求和薪资的相关性）
* [ ] **Remote vs Onsite 薪资相关性**

## 8. 技能共现分析

* [ ] 统计技能的 **共现矩阵**（Python + Django, React + Node 等）
* [ ] 绘制 **技能共现网络图**（NetworkX/Gephi）

## 9. 向量化对比

* [ ] 将 `responsibilities` 或 `技能集合` 向量化（SBERT / OpenAI Embedding）
* [ ] **岗位间相似度**（职位相似度聚类）
* [ ] **简历向量 vs 岗位向量**（计算匹配度评分）

## 10. 聚类 & 降维

* [ ] 用 **KMeans/DBSCAN/HDBSCAN** 聚类岗位（按技能/职责）
* [ ] 用 **t-SNE / UMAP** 可视化岗位空间分布

## 11. 趋势分析（如果有时间维度）

* [ ] **技能热度随时间变化**（如 Python → 上升，PHP → 下降）
* [ ] **薪资趋势随时间变化**
* [ ] **行业招聘趋势**

## 12. 岗位-技能二部图

* [ ] 构建 **岗位 ↔ 技能** 的二部图
* [ ] 投影成 **技能-技能图**（常一起出现的技能组合）
* [ ] 投影成 **岗位-岗位图**（技能要求相似的岗位）

---

✅ 这样一份清单能覆盖：

* **基础画像**（岗位属性/薪资/技能/职责）
* **政策&行业信息**（签证/行业）
* **高级挖掘**（相关性/共现/向量/聚类/趋势/网络图）

