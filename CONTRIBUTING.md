# Contributing to ApplyDay

First off, thank you for considering contributing to ApplyDay! 🎉 

It's people like you that make ApplyDay such a great tool for job seekers worldwide. We welcome contributions from everyone, regardless of experience level.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

### Our Pledge

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git** - for version control
- **Docker & Docker Compose** - for easy development setup
- **Node.js 20+** - for frontend development
- **Python 3.12+** - for backend development
- **Code Editor** - VS Code recommended with extensions

### Quick Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/pandalow/applyday.git
   cd applyday
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/pandalow/applyday.git
   ```

## 💡 Ways to Contribute

### 🐛 Bug Reports
Found a bug? Help us fix it!
- Check [existing issues](https://github.com/pandalow/applyday/issues) first
- Use our bug report template
- Include steps to reproduce
- Add screenshots if applicable

### ✨ Feature Requests
Have an idea for improvement?
- Check [discussions](https://github.com/pandalow/applyday/discussions) first
- Use our feature request template
- Explain the use case clearly
- Consider implementation complexity

### 🔧 Code Contributions
Ready to code? Here are areas where we need help:

#### Frontend (React/JavaScript)
- UI/UX improvements
- Data visualization enhancements
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness

#### Backend (Python/Django)
- API improvements
- Database optimizations
- AI integration enhancements
- NLP processing improvements
- Security enhancements

#### Data & Analytics
- Skill taxonomy expansion
- Industry analysis tools
- Job market insights
- Machine learning models

#### DevOps & Infrastructure
- Docker optimizations
- CI/CD improvements
- Testing automation
- Documentation updates

### 📖 Documentation
- API documentation
- User guides
- Developer tutorials
- Code comments
- README improvements

### 🌍 Internationalization
- Translation to other languages
- Localization improvements
- Cultural adaptations

## 🛠️ Development Setup

### Option 1: Docker (Recommended)

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/applyday.git
cd applyday

# Copy environment file
cp .env.example .env
# Edit .env with your settings

# Start development environment
docker compose -f docker-compose.dev.yml up -d

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: PostgreSQL on port 5432
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend/applyday

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# Setup database
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend/applyday

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-number-description
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Frontend tests
cd frontend/applyday
npm run test
npm run lint
npm run test:e2e

# Backend tests
cd backend/applyday
python manage.py test
python -m pytest
flake8 .
black --check .

# Full integration test
docker compose -f docker-compose.test.yml up --abort-on-container-exit
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples
git commit -m "feat: add skills network visualization"
git commit -m "fix: resolve API authentication issue"
git commit -m "docs: update installation instructions"
git commit -m "test: add unit tests for report generation"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 📏 Coding Standards

### Frontend (React/JavaScript)

```javascript
// Use ES6+ features
const MyComponent = ({ data, onUpdate }) => {
  // Use hooks for state management
  const [loading, setLoading] = useState(false);
  
  // Use proper error handling
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.submitData(data);
      onUpdate?.();
    } catch (error) {
      console.error('Submit failed:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Use semantic HTML */}
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
        aria-label="Submit form"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};
```

**Guidelines:**
- Use TypeScript where possible
- Follow ESLint and Prettier configs
- Use semantic HTML elements
- Implement proper accessibility
- Add PropTypes or TypeScript types
- Use meaningful variable names
- Keep components small and focused

### Backend (Python/Django)

```python
# Use type hints
from typing import List, Optional, Dict, Any
from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['POST'])
def create_application(request: Request) -> JsonResponse:
    """Create a new job application."""
    try:
        # Validate input
        serializer = ApplicationSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse(
                {'error': 'Invalid data', 'details': serializer.errors},
                status=400
            )
        
        # Create application
        application = serializer.save(user=request.user)
        
        return JsonResponse({
            'id': application.id,
            'message': 'Application created successfully'
        }, status=201)
        
    except Exception as e:
        logger.error(f"Failed to create application: {e}")
        return JsonResponse(
            {'error': 'Internal server error'},
            status=500
        )
```

**Guidelines:**
- Follow PEP 8 style guide
- Use type hints for functions
- Add comprehensive docstrings
- Handle exceptions properly
- Use meaningful variable names
- Keep functions small and focused
- Add logging for debugging

### Database

```python
# Good model example
class Application(models.Model):
    """Job application model."""
    
    class Status(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        INTERVIEW = 'interview', 'Interview'
        REJECTED = 'rejected', 'Rejected'
        OFFER = 'offer', 'Offer'
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='applications'
    )
    company_name = models.CharField(max_length=200)
    job_title = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED
    )
    applied_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_date']
        indexes = [
            models.Index(fields=['user', 'status']),
        ]
```

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure your code follows our standards**
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Test thoroughly** in multiple environments
5. **Squash commits** if necessary

### PR Template

When creating a pull request, use our template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Automated checks** must pass
2. **At least one maintainer** review required
3. **Address feedback** promptly
4. **Keep discussions respectful**
5. **Update based on review**

## 📝 Issue Guidelines

### Bug Reports

Use our bug report template with:

- **Environment details** (OS, browser, version)
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots/logs**
- **Additional context**

### Feature Requests

Include:

- **Problem description**
- **Proposed solution**
- **Alternatives considered**
- **Use cases**
- **Implementation notes**

### Good First Issues

Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`
- `frontend`
- `backend`

## 🧪 Testing

### Frontend Testing

```bash
# Unit tests
npm run test

# Component testing
npm run test:component

# End-to-end tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Backend Testing

```bash
# Unit tests
python manage.py test

# With coverage
coverage run --source='.' manage.py test
coverage report

# Specific app
python manage.py test application.tests
```

### Integration Testing

```bash
# Full stack test
docker compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📚 Documentation

### Code Documentation

- **Functions**: Clear docstrings with parameters and return values
- **Classes**: Purpose and usage examples
- **Modules**: Overview and main functionality
- **APIs**: Request/response examples

### User Documentation

- **Features**: How to use new functionality
- **Setup**: Installation and configuration steps
- **Troubleshooting**: Common issues and solutions
- **Examples**: Real-world usage scenarios

## 🌐 Community

### Communication Channels

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Pull Requests** - Code review and collaboration

### Getting Help

1. **Check documentation** first
2. **Search existing issues** and discussions
3. **Ask questions** in discussions
4. **Be specific** about your problem
5. **Provide context** and examples

### Recognition

Contributors are recognized through:

- **Contributors list** in README
- **Release notes** mentions
- **GitHub achievements**
- **Special thanks** in major releases

## 🎯 Project Priorities

### High Priority
- Core functionality stability
- User experience improvements
- Performance optimizations
- Security enhancements

### Medium Priority
- New features and integrations
- Advanced analytics
- Mobile responsiveness
- Internationalization

### Low Priority
- Experimental features
- Nice-to-have improvements
- Research and exploration

## 📞 Contact

- **Maintainers**: Open an issue or discussion
- **Security Issues**: Email maintainers directly
- **General Questions**: GitHub Discussions
- **Feature Requests**: GitHub Issues

---

## 🙏 Thank You!

Every contribution makes ApplyDay better for job seekers worldwide. Whether you're fixing a typo, adding a feature, or helping others in discussions, you're making a difference.

**Happy Contributing!** 🚀

---

*This guide is a living document. Please suggest improvements!*
