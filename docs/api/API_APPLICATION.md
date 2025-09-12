### Base URL
```
http://localhost:8000/
```

### Authentication
The API currently uses Django REST Framework's standard authentication.

---

## API Endpoints

### 1. Job Application Management (Applications)

Base Path: `/app/info/`

#### 1.1 Get All Applications
```http
GET /app/info/
```

**Query Parameters:**
- `job_title` (optional): Filter by job title (partial match)
- `company` (optional): Filter by company name (partial match)  
- `status` (optional): Filter by application status (exact match)
  - Available values: `prepared`, `applied`, `interviewed`, `offered`, `rejected`

**Response Example:**
```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "company": "Google",
      "job_title": "Software Engineer",
      "application_date": "2024-01-15",
      "status": "applied",
      "stage_notes": "Waiting for response",
      "job_description": "We are looking for a skilled software engineer..."
    }
  ]
}
```

#### 1.2 Create New Application
```http
POST /app/info/
```

**Request Body:**
```json
{
  "company": "Microsoft",
  "job_title": "Frontend Developer",
  "application_date": "2024-01-20",
  "status": "prepared",
  "stage_notes": "Application ready to submit",
  "job_description": "Job description text..."
}
```

**Response:** 201 Created + created application object

#### 1.3 Get Single Application
```http
GET /app/info/{id}/
```

**Response:** Application details object

#### 1.4 Update Application
```http
PUT /app/info/{id}/
```
**Request Body:** Complete application object

```http
PATCH /app/info/{id}/
```
**Request Body:** Partial application fields

#### 1.5 Delete Application
```http
DELETE /app/info/{id}/
```

**Response:** 204 No Content

#### 1.6 Get Application Statistics
```http
GET /app/info/get_stats/
```

**Response Example:**
```json
{
  "data": {
    "total": 50,
    "applied": 25,
    "rejected": 10,
    "interviewed": 8,
    "offered": 7
  }
}
```

---

### 2. Job Description Management (Job Descriptions)

Base Path: `/app/jd/`

#### 2.1 Get All Job Descriptions
```http
GET /app/jd/
```

**Response Example:**
```json
{
  "count": 15,
  "results": [
    {
      "id": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "company": "Apple",
      "role": "iOS Developer",
      "level": "Senior",
      "location": "Cupertino, CA",
      "employment_type": "Full-time",
      "salary_eur_min": 80000.0,
      "salary_eur_max": 120000.0,
      "bonus_percent": 15.0,
      "benefits": ["Health Insurance", "Stock Options"],
      "years_experience_min": 5,
      "years_experience_max": 10,
      "education_required": "Bachelor's degree in Computer Science",
      "responsibilities": ["Develop iOS apps", "Code review"],
      "required_core_skills": ["Swift", "iOS SDK", "Xcode"],
      "desirable_skills": ["SwiftUI", "Core Data"],
      "programming_languages": ["Swift", "Objective-C"],
      "frameworks_tools": ["UIKit", "SwiftUI", "Xcode"],
      "databases": ["Core Data", "SQLite"],
      "cloud_platforms": ["AWS", "iCloud"],
      "api_protocols": ["REST", "GraphQL"],
      "methodologies": ["Agile", "Scrum"],
      "mobile_technologies": ["iOS", "watchOS"],
      "domain_keywords": ["mobile", "iOS", "app"],
      "remote_work": "hybrid",
      "work_permit_required": false,
      "visa_sponsorship": true,
      "contact_person": "John Smith",
      "contact_email_or_phone": "john@apple.com",
      "industry": "Technology",
      "language_requirements": ["English"],
      "job_text": {
        "id": 1,
        "text": "Original job description text...",
        "created_at": "2024-01-15T10:30:00Z",
        "application": null
      }
    }
  ]
}
```

#### 2.2 Create Job Description
```http
POST /app/jd/
```

**Request Body Example:**
```json
{
  "company": "Netflix",
  "role": "Backend Engineer",
  "level": "Mid-level",
  "location": "Dublin, Ireland",
  "employment_type": "Full-time",
  "salary_eur_min": 70000.0,
  "salary_eur_max": 90000.0,
  "remote_work": "remote",
  "required_core_skills": ["Python", "Django", "PostgreSQL"],
  "programming_languages": ["Python", "JavaScript"]
}
```

#### 2.3 Get/Update/Delete Single Job Description
```http
GET /app/jd/{id}/
PUT /app/jd/{id}/
PATCH /app/jd/{id}/
DELETE /app/jd/{id}/
```

---

### 3. Job Description Text Management (Job Description Text)

Base Path: `/app/extract/`

#### 3.1 Get All Job Description Texts
```http
GET /app/extract/
```

**Response Example:**
```json
{
  "count": 20,
  "results": [
    {
      "id": 1,
      "text": "We are seeking a talented software engineer...",
      "created_at": "2024-01-15T10:30:00Z",
      "application": 1
    }
  ]
}
```

#### 3.2 Create Job Description Text
```http
POST /app/extract/
```

**Request Body:**
```json
{
  "text": "Full job description text here...",
  "application": 1
}
```

#### 3.3 Partial Update Job Description Text
```http
PATCH /app/extract/{id}/
```

**Note:** Only allows updating the `text` field

**Request Body:**
```json
{
  "text": "Updated job description text..."
}
```

#### 3.4 Get/Delete Single Job Description Text
```http
GET /app/extract/{id}/
DELETE /app/extract/{id}/
```

---

### 4. Resume Text Management (Resume Text)

Base Path: `/app/resumes/`

#### 4.1 Get All Resumes
```http
GET /app/resumes/
```

**Response Example:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "John_Doe_Resume",
      "text": "Extracted text from PDF resume...",
      "uploaded_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 4.2 Upload Resume PDF File
```http
POST /app/resumes/
```

**Request Body (multipart/form-data):**
- `name`: Resume name
- `file`: PDF file

**Response:** Automatically extracts PDF text and saves to `text` field

#### 4.3 Get/Update/Delete Single Resume
```http
GET /app/resumes/{id}/
PUT /app/resumes/{id}/
PATCH /app/resumes/{id}/
DELETE /app/resumes/{id}/
```
## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid fields for partial update."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 422 Validation Error
```json
{
  "field_name": ["This field is required."]
}
```

---

## Usage Examples

### Complete Job Application Workflow

1. **Upload Resume:**
```bash
curl -X POST http://localhost:8000/app/resumes/ \
  -F "name=John_Doe_CV" \
  -F "file=@/path/to/resume.pdf"
```

2. **Create Application:**
```bash
curl -X POST http://localhost:8000/app/info/ \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "job_title": "Software Engineer",
    "application_date": "2024-01-20",
    "status": "prepared",
    "job_description": "We are looking for..."
  }'
```

3. **Update Application Status:**
```bash
curl -X PATCH http://localhost:8000/app/info/1/ \
  -H "Content-Type: application/json" \
  -d '{"status": "applied"}'
```

4. **Get Statistics:**
```bash
curl http://localhost:8000/app/info/get_stats/
```

### Filtering and Search

```bash
# Filter by company
curl "http://localhost:8000/app/info/?company=Google"

# Filter by status
curl "http://localhost:8000/app/info/?status=applied"

# Combined filtering
curl "http://localhost:8000/app/info/?company=Google&status=applied&job_title=engineer"
```

---

## Notes

1. **Sorting:** Applications are sorted by creation time in descending order (newest first)
2. **File Upload:** Only PDF format is supported for resume uploads
3. **Text Extraction:** PDF text extraction is automatically performed using PyPDF2 library
4. **Data Validation:** All model fields have appropriate validation rules
5. **Optional Fields:** Most fields are optional, supporting progressive data entry
6. **JSON Fields:** Skills, benefits, etc. are stored as JSON arrays for extensibility

---

## Version Information

- **API Version:** v1
- **Django Version:** 5.2
- **Django REST Framework Version:** Latest
- **Database:** SQLite (development environment)
