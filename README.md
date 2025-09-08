# ApplyDay – Personal Job Search Dashboard

<div align="center">

![ApplyDay Banner](https://capsule-render.vercel.app/api?type=cylinder&color=0:a8edea,50:fed6e3,100:ffd89b&height=120&section=header&text=ApplyDay&fontSize=50&fontColor=2c3e50&desc=Your%20personal%20job%20search%20dashboard,%20powered%20by%20data&descAlignY=80)

[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red?style=flat-square)](https://github.com/pandalow/applyday)
[![Privacy First](https://img.shields.io/badge/Privacy-🔒%20Local%20Only-green?style=flat-square)](#privacy-first)
[![Human in Loop](https://img.shields.io/badge/Human--in--Loop-🤝-orange?style=flat-square)](#philosophy)


</div>

> **🎯 One-Click Deployment Available!** – Automated setup scripts for Linux/macOS/Windows. See [**📖 Deployment Guide**](docs/DEPLOYMENT.md).

---

## 📸 Showcase

<div align="center">
<img src="docs/images/showcase.gif" alt="ApplyDay Demo" width="800" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

---

## 📋 Overview

This project was born from my own job search. I built it to track applications, analyze trends, and identify gaps—and now it's actively supporting me in the process. I've always believed that **data can help you succeed**. In today's recruitment market, every applicant seems reduced to just another "data point." Companies have powerful dashboards, full business analytics, and market insights to find the right candidates. But what about us—the applicants, the so-called data carriers? 

**This software is my answer: your own personal dashboard system.**

Most resume assistants and job platforms focus on "how to package yourself"—with fancier wording, or even fabricated experiences, to fit a role. But that's only a short-term tactic. What truly determines long-term success is the real skills you possess and continuously improve.

### ✅ What ApplyDay CAN do

- Record applications with conversion funnel tracking
- AI-powered skill gap analysis and market insights  
- Generate personalized learning roadmaps
- Support multiple LLM providers (OpenAI, Anthropic, Google)

### ❌ What ApplyDay WON'T do

- Auto-submit resumes or fabricate experiences
- Share your data with third parties (100% local deployment, only interacts with your specified LLM)
- Replace your critical thinking and decision-making
  
---

## 🚀 Quick Start

### ⚡ One-Click Deployment

**Linux/macOS:**
```bash
git clone https://github.com/pandalow/applyday.git && cd applyday && chmod +x deploy.sh && ./deploy.sh
```

**Windows:**
```cmd
git clone https://github.com/pandalow/applyday.git && cd applyday && deploy.bat
```

**Access:** Open `http://localhost` after deployment completes.

### 🐳 Manual Docker Setup

```bash
git clone https://github.com/pandalow/applyday.git && cd applyday
cp .env.example .env  # Configure your AI provider
docker compose up -d
```

### ⚙️ Environment Configuration

Create `.env` file with your AI provider:

```env
# Choose your AI provider
AI_PROVIDER=openai                    # Options: openai, anthropic, google
AI_MODEL=gpt-4o                      # Provider-specific model
AI_TEMPERATURE=0                     # Response randomness

# Add the API key for your chosen provider
OPENAI_API_KEY=your_key_here         # If using OpenAI
ANTHROPIC_API_KEY=your_key_here      # If using Anthropic  
GOOGLE_API_KEY=your_key_here         # If using Google
```

---

## 🔧 Tech Stack
### 📊 Dependencies Overview

<table>
<tr>
<td><b>Frontend</b></td>
<td><b>Backend</b></td>
<td><b>AI & Analytics</b></td>
<td><b>DevOps</b></td>
</tr>
<tr>
<td>

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI Framework |
| Vite | Latest | Build Tool |
| TailwindCSS | Latest | Styling |
| ECharts | Latest | Visualization |
| Framer Motion | Latest | Animations |

</td>
<td>

| Package | Version | Purpose |
|---------|---------|---------|
| Django | 5.2 | Web Framework |
| DRF | Latest | API Framework |
| spaCy | Latest | NLP Processing |
| SQLite | Default | Database |
| Gunicorn | Latest | WSGI Server |

</td>
<td>

| Package | Version | Purpose |
|---------|---------|---------|
| LangChain | Latest | AI Integration |
| OpenAI | Latest | GPT Models |
| Anthropic | Latest | Claude Models |
| scikit-learn | Latest | ML Algorithms |
| pandas | Latest | Data Analysis |

</td>
<td>

| Package | Version | Purpose |
|---------|---------|---------|
| Docker | Latest | Containerization |
| Nginx | Latest | Web Server |
| Docker Compose | Latest | Orchestration |

</td>
</tr>
</table>

### 🏗️ Architecture

```
ApplyDay/
├── 🎨 frontend/           # React + Vite + TailwindCSS
│   └── applyday/
│       ├── src/
│       │   ├── components/    # UI components
│       │   ├── pages/         # Application pages  
│       │   ├── charts/        # Data visualizations
│       │   └── service/       # API integration
│       └── Dockerfile
├── ⚙️ backend/            # Django + AI Services
│   └── applyday/
│       ├── application/       # Job tracking models
│       ├── report/           # Analysis & reports
│       ├── ai/              # AI integration
│       │   ├── chain/        # LangChain prompts
│       │   └── services/     # AI implementations
│       └── requirements.txt
├── 📄 docs/              # Documentation & screenshots
├── 🚀 deploy.sh          # One-click deployment
└── 🐳 docker-compose.yml # Full-stack deployment
```

---

## ✨ Features

### 📊 Core Capabilities
- **Application Tracking** – Pipeline management with conversion funnel
- **AI-Powered Analysis** – Skill gap identification and market insights
- **Data Visualization** – Interactive charts and network graphs
- **Resume Integration** – Upload and analyze against market demands
- **Growth Roadmaps** – Personalized learning paths

### 🔒 Privacy & Security
- **100% Local** – No cloud uploads, complete data control
- **Open Source** – Full transparency, community-driven
- **Self-Hosted** – Your infrastructure, your rules

### 🤖 AI Providers

| Provider | Models | Strengths |
|----------|---------|-----------|
| **OpenAI** | GPT-4o, GPT-4o-mini | Best overall performance |
| **Anthropic** | Claude-3 Haiku/Sonnet/Opus | Strong reasoning, safety |
| **Google** | Gemini Pro | Fast, cost-effective |

---

## 📖 User Guide

### 1️⃣ Record Applications
Navigate to **Applications** → **Add Application** → Fill details (company, role, JD, status)

### 2️⃣ Upload Resume  
Go to **Resume Management** → Upload PDF/DOC → Automatic skill extraction

### 3️⃣ Generate Reports
Select applications → Choose analysis scope → **Generate Report** → Review AI insights

### 4️⃣ Understand Insights
- **Must-Have Skills**: Core market demands
- **Differentiating Skills**: Specialized competencies  
- **Skill Synergies**: Related skills to learn together
- **Action Plans**: Step-by-step improvement roadmap

---

## 🤝 Contributing

| Type | How to Help |
|------|-------------|
| � **Bug Reports** | [Open an issue](https://github.com/pandalow/applyday/issues) |
| 💡 **Feature Ideas** | [Start a discussion](https://github.com/pandalow/applyday/discussions) |
| 🔧 **Code** | Fork → Feature branch → Pull request |
| 📖 **Docs** | Improve guides and documentation |
| 🏷️ **Skills** | Add industry skills and job categories |

### Development Setup

<details>
<summary>Click to expand development instructions</summary>

**Backend:**
```bash
cd backend/applyday
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate && python manage.py runserver
```

**Frontend:**
```bash
cd frontend/applyday
npm install && npm run dev
```
</details>

---

## 🗺️ Roadmap

| Version | Status | Features |
|---------|--------|----------|
| **v0.1** | ✅ Current | Application tracking, AI analysis, Docker deployment |
| **v0.5** | 🔄 Planned | Enhanced skill taxonomy, multi-LLM, advanced analytics |
| **v1.0** | 📋 Future | Interview prep, salary insights, job board integration |

---

## 🆘 Support

### Quick Help

| Issue | Solution |
|-------|----------|
| **Empty dashboard** | Check backend container: `docker logs applyday_backend` |
| **AI analysis fails** | Verify API key in `.env` file |
| **Build errors** | Run `docker system prune` and retry |

### Get Help
- 📚 **Documentation**: [GitHub Wiki](https://github.com/pandalow/applyday/wiki)
- 💬 **Community**: [Discussions](https://github.com/pandalow/applyday/discussions)  
- 🐛 **Bug Reports**: [Issues](https://github.com/pandalow/applyday/issues)

---

## 📄 License

**GPL License** – See [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ for job seekers, by job seekers**

[⭐ Star this project](https://github.com/pandalow/applyday) • [🍴 Fork it](https://github.com/pandalow/applyday/fork) • [📢 Share it](https://twitter.com/intent/tweet?text=Check%20out%20ApplyDay%20-%20Your%20Personal%20Job%20Application%20Dashboard!&url=https://github.com/pandalow/applyday)

</div>



