# ApplyDay – 个人求职仪表盘

<div align="center">

🌐 [English](README.md) | [中文](README.zh-CN.md)

![ApplyDay Banner](https://capsule-render.vercel.app/api?type=cylinder&color=0:a8edea,50:fed6e3,100:ffd89b&height=120&section=header&text=ApplyDay&fontSize=50&fontColor=2c3e50&desc=您的个人求职仪表盘，由数据驱动&descAlignY=80)

[![Open Source](https://img.shields.io/badge/开源-❤️-red?style=flat-square)](https://github.com/pandalow/applyday)
[![Privacy First](https://img.shields.io/badge/隐私-🔒%20本地运行-green?style=flat-square)](#隐私与安全)
[![Human in Loop](https://img.shields.io/badge/人类参与-🤝-orange?style=flat-square)](#理念)

</div>

> **🎯 一键部署可用！** – 提供 Linux/macOS/Windows 自动化脚本。详见 [**📖 部署指南**](docs/DEPLOYMENT.md)。

---

## 📸 演示

<div align="center">
<img src="docs/images/showcase.gif" alt="ApplyDay Demo" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

---

## 📋 概述

这个项目源于我自己的求职需求。我开发它来跟踪投递、分析趋势、发现不足——现在它在我的求职过程中真正发挥作用。我始终相信 **数据能帮你成功**。在当今的招聘市场，每位候选人似乎都只是一个“数据点”。公司有强大的仪表盘、商业分析和市场洞察来寻找合适人选。那么我们呢？作为“数据载体”的求职者？

**这款软件就是我的答案：属于你自己的个人求职仪表盘。**

大多数简历助手和招聘平台专注于“如何包装自己”——用更花哨的语言，甚至虚构经历来匹配岗位。但这只是短期策略。真正决定长期成功的，是你实际拥有并持续提升的技能。

### ✅ ApplyDay 可以做的事
- 记录申请并跟踪转化漏斗  
- AI 驱动的技能差距分析和市场洞察  
- 生成个性化学习路线图  
- 支持多家大模型供应商（OpenAI、Anthropic、Google）  

### ❌ ApplyDay 不会做的事
- 自动投递简历或虚构经历  
- 将你的数据分享给第三方（100% 本地运行，仅与你配置的 LLM 交互）  
- 取代你的思考与决策  

---

## 🚀 快速开始

### ⚡ 一键部署

**Linux/macOS:**
```bash
git clone https://github.com/pandalow/applyday.git && cd applyday && chmod +x deploy.sh && ./deploy.sh
**Windows**
git clone https://github.com/pandalow/applyday.git && cd applyday && deploy.bat

访问地址: 部署完成后打开 http://localhost

🐳 手动 Docker 部署
git clone https://github.com/pandalow/applyday.git && cd applyday
cp .env.example .env  # 配置你的 AI 提供商
docker compose up -d


🔄 部署流程

首次部署:

运行上述完整脚本或一键部署

会从零构建容器并配置环境

后续启动/更新:

# 常规重启（无代码变更）
docker compose up -d

# 更新代码后
docker compose down
docker compose up -d --build

# 小改动后的快速重启
docker compose restart

💡 提示: 如果未修改代码且容器已构建，简单执行 docker compose up -d 即可。

⚙️ 环境配置

在根目录创建 .env 文件，配置你的 AI 提供商：
AI_PROVIDER=openai               # 可选: openai, anthropic, google
AI_MODEL=gpt-4o                  # 对应模型
AI_TEMPERATURE=0                 # 回答随机度

OPENAI_API_KEY=your_key_here     # OpenAI 密钥
ANTHROPIC_API_KEY=your_key_here  # Anthropic 密钥  
GOOGLE_API_KEY=your_key_here     # Google 密钥


🔧 技术栈

（保持和英文版一致，只翻译标题和说明，依赖表格不变）



✨ 功能特点

申请跟踪 – 管理申请流程和转化漏斗

AI 分析 – 技能差距识别和市场洞察

数据可视化 – 交互式图表和网络关系图

简历集成 – 上传并分析与市场需求的匹配度

成长路线 – 个性化学习计划

🔒 隐私与安全

100% 本地运行 – 无云端上传，完全掌控数据

开源透明 – 完全公开，社区驱动

自托管 – 运行在你自己的环境中

📖 使用指南

1️⃣ 添加申请
2️⃣ 上传简历
3️⃣ 生成报告
4️⃣ 分析洞察

🤝 贡献

欢迎通过 issue、讨论区、PR 改进项目。

| 版本       | 状态    | 功能                   |
| -------- | ----- | -------------------- |
| **v0.1** | ✅ 当前  | 申请跟踪、AI 分析、Docker 部署 |
| **v0.5** | 🔄 计划 | 增强技能分类、多模型支持、进阶分析    |
| **v1.0** | 📋 未来 | 面试准备、薪资洞察、职位平台集成     |

🆘 支持

常见问题见 Wiki
，或在 Discussions
 发帖。

📄 许可证

GPL License – 详情见 LICENSE 。


<div align="center">

由求职者为求职者打造 ❤️

⭐ 收藏项目
 • 🍴 Fork 项目
 • 📢 分享

