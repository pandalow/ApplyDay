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
            "programming_languages": {
              "python": 15,
              "javascript": 12,
              "java": 8
            },
            "frameworks_tools": {
              "django": 10,
              "react": 8,
              "spring": 5
            },
            "databases": {
              "postgresql": 7,
              "mysql": 5,
              "mongodb": 4
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
        "programming_languages": {
          "python": 23,
          "javascript": 18,
          "java": 12,
          "typescript": 9
        },
        "frameworks_tools": {
          "react": 15,
          "django": 14,
          "spring": 8,
          "angular": 7
        },
        "cloud_platforms": {
          "aws": 16,
          "azure": 8,
          "gcp": 5
        },
        "databases": {
          "postgresql": 12,
          "mysql": 10,
          "mongodb": 7,
          "redis": 5
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
  "message": "Extraction completed"
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
        "name": "skill_analysis",
        "result": {
          "programming_languages": {
            "python": 18,
            "javascript": 15,
            "java": 8,
            "typescript": 6
          },
          "frameworks_tools": {
            "react": 12,
            "django": 11,
            "spring": 7,
            "angular": 5
          },
          "cloud_platforms": {
            "aws": 14,
            "azure": 7,
            "gcp": 4
          },
          "databases": {
            "postgresql": 10,
            "mysql": 8,
            "mongodb": 6
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
  "summary": "# Job Market Analysis Summary\n\n## Key Insights\n\nBased on your resume, you match 85% of the market requirements for the analyzed positions. Here's a comprehensive breakdown:\n\n### Your Strengths\n- Excellent Python and Django experience\n- Strong problem-solving skills\n- Good understanding of web technologies\n\n### Skill Gaps to Address\n- **Docker**: High priority - containerization is increasingly important\n- **Kubernetes**: Essential for scalable deployments\n- **AWS**: Cloud platform experience is highly valued\n\n### Recommended Actions\n1. Complete Docker fundamentals course (2-3 weeks)\n2. Gain cloud platform experience with AWS\n3. Strengthen DevOps skills\n\n### Career Progression\n- **Current Level**: Mid-level Developer\n- **Next Steps**: Senior Developer, Tech Lead\n- **Timeline**: 12-18 months with focused learning"
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
  "summary": "# Personalized Career Analysis\n\n## Profile Assessment\n\nYour profile shows strong alignment with 78% of analyzed positions in the current job market.\n\n## Key Strengths\n- **Excellent Python and Django experience**: Core technologies in high demand\n- **Strong problem-solving skills**: Essential for technical roles\n- **Good understanding of web technologies**: Solid foundation for full-stack development\n\n## Areas for Improvement\n\n### High Priority Skills\n- **Cloud platforms (AWS/Azure)**: 65% of positions require cloud experience\n- **Containerization (Docker/Kubernetes)**: Critical for modern deployments\n- **Advanced database optimization**: Valuable for senior roles\n\n## Market Insights\n- **Requirements Match**: 78% alignment with target positions\n- **Top Missing Skills**: Docker, AWS, React\n- **Salary Potential**:\n  - Current estimate: €65,000 - €75,000\n  - With improvements: €80,000 - €95,000\n\n## Recommended Action Plan\n\n### Immediate Focus (Next 3 months)\n1. **Docker Fundamentals** (Priority: High)\n   - Complete Docker fundamentals course\n   - Estimated time: 2-3 weeks\n\n2. **AWS Cloud Practitioner** (Priority: High)\n   - AWS certification preparation\n   - Estimated time: 4-6 weeks\n\n### Career Progression\nWith focused learning on these key areas, you can advance to senior developer roles within 12-18 months."
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