# ApplyDay Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-38B2AC?style=flat-square&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)

Modern React frontend application providing intuitive user interface for ApplyDay personal job search dashboard

</div>

---

## 📋 Project Overview

ApplyDay Frontend is a modern React-based single-page application that provides a complete job search management interface. The application features responsive design, supports both desktop and mobile access, and integrates data visualization, AI analysis reports, and more.

### 🎯 Core Features

- **📊 Dashboard** - Job search data overview and statistical charts
- **📝 Application Management** - Record and track job application status
- **🔍 Job Description Extraction** - AI-powered job information extraction and analysis
- **📈 Data Reports** - Personalized career insights and skill analysis reports
- **📱 Responsive Design** - Perfect adaptation to various device sizes

---

## 🛠️ Tech Stack

### Core Framework
- **React 19.1.1** - Latest React framework with concurrent features
- **Vite 7.1.2** - Lightning-fast build tool and dev server
- **React Router 7.8.2** - Client-side routing management

### UI and Styling
- **TailwindCSS 4.1.12** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Smooth animations and interactions

### Data Visualization
- **ECharts 5.6.0** - Powerful charting library
- **ECharts for React 3.0.2** - React wrapper for ECharts
- **ECharts WordCloud 2.1.0** - Word cloud chart support
- **Recharts 3.1.2** - React native charting library

### Utilities
- **Axios 1.11.0** - HTTP client library
- **React Markdown 10.1.0** - Markdown rendering support
- **html2canvas 1.4.1** - Screenshot and image export functionality

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 or **yarn** >= 1.22.0

### Install Dependencies

```bash
cd frontend/applyday
npm install
```

Or using yarn:

```bash
cd frontend/applyday
yarn install
```

### Environment Configuration

Create a `.env` file in the `frontend/applyday` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://127.0.0.1:8000

# Application Management API
VITE_APPLICATION_API=http://127.0.0.1:8000/app/

# Report Generation API
VITE_REPORT_API=http://127.0.0.1:8000/report/
```

### Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build files will be output to the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
frontend/applyday/
├── public/                 # Static assets
│   ├── logo.png           # App icon
│   └── vite.svg           # Vite icon
├── src/
│   ├── assets/            # Project assets
│   │   ├── logo.png       # Main logo
│   │   └── react.svg      # React icon
│   ├── charts/            # Chart components
│   │   ├── FrequencyChart.jsx      # Frequency chart
│   │   ├── PieChart.jsx            # Pie chart
│   │   ├── SkillsNetworkChart.jsx  # Skills network chart
│   │   ├── TFIDFChart.jsx          # TF-IDF analysis chart
│   │   └── WordCloudChart.jsx      # Word cloud chart
│   ├── components/        # Reusable components
│   │   ├── ApplicationForm.jsx     # Application form
│   │   ├── ApplicationItem.jsx     # Application item
│   │   ├── Dashboard.jsx           # Dashboard
│   │   ├── Extracting.jsx          # Extracting state
│   │   ├── ExtractionForm.jsx      # Extraction form
│   │   ├── ExtractionItem.jsx      # Extraction item
│   │   ├── Footer.jsx              # Footer
│   │   ├── JDitem.jsx              # Job description item
│   │   ├── JDpage.jsx              # Job description page
│   │   ├── JDTextManagement.jsx    # Job description text management
│   │   ├── Navigation.jsx          # Navigation bar
│   │   ├── ReportAnalysis.jsx      # Report analysis
│   │   ├── ReportDetail.jsx        # Report detail
│   │   ├── ReportGenerator.jsx     # Report generator
│   │   ├── ReportItem.jsx          # Report item
│   │   ├── ResumeManager.jsx       # Resume manager
│   │   └── RootLayout.jsx          # Root layout
│   ├── config/            # Configuration files
│   │   └── api.js         # API configuration
│   ├── css/               # Style files
│   ├── locales/           # Internationalization files
│   ├── pages/             # Page components
│   │   ├── Application.jsx # Application management page
│   │   ├── Data.jsx       # Data management page
│   │   ├── Home.jsx       # Home page
│   │   └── Report.jsx     # Report page
│   ├── service/           # Service layer
│   ├── App.css            # App styles
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.jsx           # App entry point
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── nginx.conf             # Nginx configuration
├── package.json           # Project dependencies
├── README.md              # Project documentation
└── vite.config.js         # Vite configuration
```

---

## 🎨 Main Pages

### 🏠 Home
- Project introduction and quick navigation
- Feature showcase
- Quick start guide

### 📊 Application Management
- Job application records and management
- Application status tracking
- Application data statistics and visualization

### 🔍 Data Management
- Job description text extraction
- AI-powered information parsing
- Extraction history management

### 📈 Report Center
- Personalized career analysis reports
- Skills gap analysis
- Market trend insights
- Learning path recommendations

---

## 🎨 Component Library

### 📊 Chart Components (`charts/`)
- **FrequencyChart** - Frequency distribution charts
- **PieChart** - Pie chart displays
- **SkillsNetworkChart** - Skills relationship network chart
- **TFIDFChart** - TF-IDF analysis visualization
- **WordCloudChart** - Word cloud charts

### 🧩 Business Components (`components/`)
- **Navigation** - Responsive navigation bar
- **Dashboard** - Data dashboard
- **ApplicationForm** - Application form
- **ReportGenerator** - Report generator
- **JDTextManagement** - Job description management

---

## 🔧 Development Guide

### Code Standards

The project uses ESLint for code quality checking:

```bash
npm run lint
```

### Development Guidelines

1. **Component Development**
   - Use functional components and React Hooks
   - Follow single responsibility principle
   - Properly split component granularity

2. **State Management**
   - Use React built-in state management
   - Appropriately use Context API for global state sharing

3. **Style Guidelines**
   - Prioritize TailwindCSS class names
   - Maintain consistent design style
   - Ensure responsive design

4. **API Calls**
   - Uniformly use Axios for HTTP requests
   - API configuration centralized in `config/api.js`
   - Properly handle errors and loading states

---

## 🚀 Deployment

### Docker Deployment

Use Docker configuration from project root directory:

```bash
# Build frontend image
docker build -f frontend/Dockerfile -t applyday-frontend .

# Run container
docker run -p 3000:80 applyday-frontend
```

### Nginx Configuration

The project includes production Nginx configuration file (`nginx.conf`) supporting:
- Static file serving
- SPA routing support
- Gzip compression
- Cache optimization

---

## 🤝 Contributing

1. Fork the project repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

---

## 📝 License

This project is licensed under the [GPL License](../LICENSE).

---

## 🔗 Related Links

- [ApplyDay Main Project](../README.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Project Demo](https://github.com/pandalow/applyday)

---

<div align="center">
<p>🚀 Modern data analysis platform built for job seekers</p>
<p>Made with ❤️ by <a href="https://github.com/pandalow">pandalow</a></p>
</div>
