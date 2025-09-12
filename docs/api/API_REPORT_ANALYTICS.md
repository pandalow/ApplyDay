# Report/Analytics API Documentation

This document describes the Report/Analytics APIs that enable data analysis, insight generation, and pipeline processing for job application data.

## Base URL
```
http://localhost:8000/report/
```

## Authentication
The API currently uses Django REST Framework's standard authentication.

---

## Overview

The Report/Analytics APIs provide powerful data analysis capabilities for job application data. These APIs enable:

- **Report Generation**: Create analytical reports from job description data
- **Data Extraction**: Process and extract insights from job descriptions
- **Pipeline Processing**: Run complete analysis pipelines combining extraction and insights
- **AI-Powered Insights**: Generate personalized summaries and recommendations

---

## API Endpoints

### 1. Report Management

Base Path: `/report/`

#### 1.1 Get All Reports
```http
GET /report/
```

**Description**: Retrieve all analysis reports with their results and latest summaries.

**Response Example:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "results": [
        {
          "id": 1,
          "name": "skill_analysis",
          "result": {
            "must_have_skills": ["Python", "Django", "REST API"],
            "nice_to_have_skills": ["Docker", "AWS", "React"],
            "skill_frequency": {
              "Python": 45,
              "Django": 32,
              "JavaScript": 28
            }
          }
        }
      ],
      "latest_summary": {
        "id": 1,
        "created_at": "2024-01-15T10:35:00Z",
        "content": "Based on analysis of 50 job descriptions, Python and Django are the most demanded skills..."
      }
    }
  ]
}
```

#### 1.2 Get Single Report
```http
GET /report/{id}/
```

**Path Parameters:**
- `id` (integer, required): The report ID

**Response**: Single report object with detailed results and summaries

#### 1.3 Create Analysis Report
```http
POST /report/
```

**Description**: Generate a new analysis report based on job description data.

**Request Body Options:**

**Option 1 - Filter by Job IDs:**
```json
{
  "job_ids": [1, 2, 3, 5, 8]
}
```

**Option 2 - Filter by Date Range:**
```json
{
  "start_at": "2024-01-01T00:00:00Z",
  "end_at": "2024-01-31T23:59:59Z"
}
```

**Option 3 - Analyze All Data:**
```json
{}
```

**Response Example:**
```json
{
  "id": 2,
  "created_at": "2024-01-16T14:20:00Z",
  "results": [
    {
      "id": 5,
      "name": "skill_analysis",
      "result": {
        "total_jobs_analyzed": 25,
        "must_have_skills": ["Python", "SQL", "Git"],
        "emerging_skills": ["Kubernetes", "GraphQL"],
        "skill_categories": {
          "programming_languages": ["Python", "JavaScript", "Java"],
          "frameworks": ["Django", "React", "Spring"],
          "tools": ["Docker", "Jenkins", "Git"]
        },
        "experience_levels": {
          "junior": 5,
          "mid": 12,
          "senior": 8
        }
      }
    },
    {
      "id": 6,
      "name": "salary_analysis",
      "result": {
        "average_salary_eur": 75000,
        "salary_range": {
          "min": 45000,
          "max": 120000
        },
        "by_experience": {
          "junior": 52000,
          "mid": 75000,
          "senior": 95000
        }
      }
    }
  ],
  "latest_summary": null
}
```

#### 1.4 Update Report
```http
PUT /report/{id}/
PATCH /report/{id}/
```

**Description**: Update report metadata (results are typically read-only)

#### 1.5 Delete Report
```http
DELETE /report/{id}/
```

**Response**: 204 No Content

---

### 2. Data Extraction Pipeline

#### 2.1 Process Data Extraction
```http
POST /report/extract/
```

**Description**: Extract and process job description data using AI services.

**Request Body Options:**

**Option 1 - Extract Specific Jobs:**
```json
{
  "job_ids": [1, 2, 3, 4, 5]
}
```

**Option 2 - Extract by Date Range:**
```json
{
  "start": "2024-01-01",
  "end": "2024-01-31"
}
```

**Option 3 - Extract All:**
```json
{}
```

**Response:**
```json
{
  "message": "Extraction completed",
  "processed_jobs": 15,
  "extraction_time": "2024-01-16T14:25:00Z"
}
```

**What This Endpoint Does:**
- Processes raw job description text using AI/NLP
- Extracts structured data (skills, requirements, salary info)
- Enriches job descriptions with categorized information
- Prepares data for analysis and reporting

---

### 3. Complete Analysis Pipeline

#### 3.1 Run Full Pipeline
```http
POST /report/run/
```

**Description**: Execute the complete analysis pipeline combining data extraction, report generation, and AI-powered insights.

**Request Body:**
```json
{
  "job_ids": [1, 2, 3, 4, 5],
  "resume_id": 2,
  "languages": ["en", "zh"]
}
```

**Parameters:**
- `job_ids` (array, optional): Specific job IDs to analyze (if not provided, analyzes all)
- `resume_id` (integer, optional): Resume ID for personalized analysis
- `languages` (array, optional): Languages for summary generation (default: ["en"])

**Response:**
```json
{
  "report": {
    "id": 3,
    "created_at": "2024-01-16T15:00:00Z",
    "results": [
      {
        "id": 7,
        "name": "market_analysis",
        "result": {
          "top_skills": ["Python", "JavaScript", "SQL"],
          "trending_technologies": ["AI/ML", "Cloud Computing", "DevOps"],
          "location_insights": {
            "remote_friendly": 65,
            "hybrid": 25,
            "onsite": 10
          }
        }
      }
    ],
    "latest_summary": {
      "id": 3,
      "created_at": "2024-01-16T15:05:00Z",
      "content": "Market analysis reveals strong demand for full-stack developers..."
    }
  },
  "summary": {
    "personalized_insights": "Based on your resume, you match 85% of the market requirements...",
    "skill_gaps": ["Docker", "Kubernetes", "AWS"],
    "recommended_actions": [
      "Consider learning containerization technologies",
      "Gain cloud platform experience",
      "Strengthen DevOps skills"
    ],
    "career_progression": {
      "current_level": "Mid-level Developer",
      "next_steps": ["Senior Developer", "Tech Lead"],
      "timeline": "12-18 months with focused learning"
    }
  }
}
```

**Pipeline Process:**
1. **Data Extraction**: Processes job descriptions using AI/NLP
2. **Analysis Generation**: Creates comprehensive market analysis
3. **Insight Generation**: Generates personalized insights based on resume
4. **Summary Creation**: Produces actionable recommendations

---

### 4. AI-Powered Insights

#### 4.1 Generate Report Summary
```http
POST /report/{report_id}/insight/
```

**Description**: Generate AI-powered insights and summary for an existing report.

**Path Parameters:**
- `report_id` (integer, required): The ID of the report to analyze

**Request Body:**
```json
{
  "resume_id": 2
}
```

**Response:**
```json
{
  "summary": {
    "personalized_analysis": "Your profile shows strong alignment with 78% of analyzed positions...",
    "strengths": [
      "Excellent Python and Django experience",
      "Strong problem-solving skills",
      "Good understanding of web technologies"
    ],
    "areas_for_improvement": [
      "Cloud platforms (AWS/Azure)",
      "Containerization (Docker/Kubernetes)",
      "Advanced database optimization"
    ],
    "market_insights": {
      "average_requirements_match": "78%",
      "top_missing_skills": ["Docker", "AWS", "React"],
      "salary_potential": {
        "current_estimate": "€65,000 - €75,000",
        "with_improvements": "€80,000 - €95,000"
      }
    },
    "action_plan": [
      {
        "priority": "High",
        "skill": "Docker",
        "learning_path": "Complete Docker fundamentals course",
        "estimated_time": "2-3 weeks"
      },
      {
        "priority": "High", 
        "skill": "AWS",
        "learning_path": "AWS Cloud Practitioner certification",
        "estimated_time": "4-6 weeks"
      }
    ]
  }
}
```

---

## Data Models

### AnalysisReport
```json
{
  "id": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "results": [AnalysisResult],
  "latest_summary": Summary
}
```

### AnalysisResult
```json
{
  "id": 1,
  "name": "skill_analysis",
  "result": {
    // JSON object containing analysis results
    // Structure varies based on analysis type
  }
}
```

### Summary
```json
{
  "id": 1,
  "created_at": "2024-01-15T10:35:00Z",
  "content": "AI-generated summary and insights text"
}
```

---

## Analysis Types

The system generates several types of analysis results:

### 1. Skill Analysis
- **Must-have skills**: Core requirements across jobs
- **Nice-to-have skills**: Desirable but not required
- **Skill frequency**: How often each skill appears
- **Skill categories**: Grouped by type (languages, frameworks, tools)

### 2. Market Analysis  
- **Trending technologies**: Emerging skills in demand
- **Experience levels**: Distribution of seniority requirements
- **Location insights**: Remote/hybrid/onsite preferences
- **Industry trends**: Sector-specific patterns

### 3. Salary Analysis
- **Average compensation**: Market rates by experience
- **Salary ranges**: Min/max compensation bands
- **Geographic variations**: Location-based differences
- **Benefit patterns**: Common perks and benefits

### 4. Personalized Insights
- **Profile matching**: How well resume fits market demands
- **Skill gaps**: Missing skills for target roles
- **Career progression**: Recommended next steps
- **Learning roadmap**: Prioritized skill development plan

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)"
}
```

### 404 Not Found
```json
{
  "detail": "Report not found."
}
```

### 422 Validation Error
```json
{
  "job_ids": ["This field cannot be empty when provided."],
  "resume_id": ["Invalid resume ID."]
}
```

### 500 Internal Server Error
```json
{
  "error": "AI service temporarily unavailable. Please try again later."
}
```

---

## Usage Examples

### Complete Analysis Workflow

1. **Extract Job Data:**
```bash
curl -X POST http://localhost:8000/report/extract/ \
  -H "Content-Type: application/json" \
  -d '{"start": "2024-01-01", "end": "2024-01-31"}'
```

2. **Generate Analysis Report:**
```bash
curl -X POST http://localhost:8000/report/ \
  -H "Content-Type: application/json" \
  -d '{"start_at": "2024-01-01T00:00:00Z", "end_at": "2024-01-31T23:59:59Z"}'
```

3. **Get Personalized Insights:**
```bash
curl -X POST http://localhost:8000/report/3/insight/ \
  -H "Content-Type: application/json" \
  -d '{"resume_id": 2}'
```

### Full Pipeline Execution

```bash
curl -X POST http://localhost:8000/report/run/ \
  -H "Content-Type: application/json" \
  -d '{
    "job_ids": [1, 2, 3, 4, 5],
    "resume_id": 2,
    "languages": ["en"]
  }'
```

### Retrieve All Reports

```bash
curl http://localhost:8000/report/
```

### Get Specific Report

```bash
curl http://localhost:8000/report/1/
```

---

## Integration Notes

### Frontend Integration

The frontend service layer (`src/service/report.js`) provides ready-to-use functions:

```javascript
import { 
  fetchReports, 
  getReport, 
  createReport, 
  processExtract, 
  generatePipeline, 
  createSummary 
} from '../service/report';

// Get all reports
const reports = await fetchReports();

// Generate new analysis
const analysisData = await generatePipeline({
  job_ids: [1, 2, 3],
  resume_id: 2,
  languages: ['en']
});

// Create personalized summary
const summary = await createSummary(reportId, resumeId);
```

### API Configuration

Base URL is configurable via environment variables:
```javascript
VITE_REPORT_API=http://localhost:8000/report/
```

### Data Flow

1. **Raw Data**: Job descriptions and resumes
2. **Extraction**: AI-powered data processing (`/extract/`)
3. **Analysis**: Statistical analysis and reporting (`POST /`)
4. **Insights**: Personalized recommendations (`/insight/`)
5. **Pipeline**: Complete end-to-end processing (`/run/`)

---

## Performance Considerations

- **Large Datasets**: Analysis of 100+ jobs may take 30-60 seconds
- **AI Processing**: Insight generation requires external API calls
- **Caching**: Reports are cached; re-analysis creates new reports
- **Rate Limits**: Respect AI provider rate limits for insight generation

---

## Version Information

- **API Version**: v1
- **Django Version**: 5.2
- **Django REST Framework**: Latest
- **AI Integration**: LangChain with multiple providers (OpenAI, Anthropic, Google)
- **Database**: SQLite (development), PostgreSQL (production recommended)

---

## Related Documentation

- [Application Management API](API_APPLICATION.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Project README](../../README.md)