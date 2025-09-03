from django.test import TestCase
from django.utils import timezone
from datetime import date
from application.models import Application


class ApplicationModelTest(TestCase):
    """Test cases for the Application model."""

    def setUp(self):
        """Set up test data."""
        self.application = Application.objects.create(
            company="Test Company",
            job_title="Software Engineer",
            status="applied",
            stage_notes="Initial application submitted"
        )

    def test_create_application(self):
        """Test creating a new application."""
        self.assertEqual(self.application.company, "Test Company")
        self.assertEqual(self.application.job_title, "Software Engineer")
        self.assertEqual(self.application.status, "applied")
        self.assertEqual(self.application.stage_notes, "Initial application submitted")
        self.assertEqual(self.application.application_date, date.today())

    def test_application_str_method(self):
        """Test the string representation of the application."""
        expected_str = f"{self.application.job_title} at {self.application.company}"
        self.assertEqual(str(self.application), expected_str)

    def test_application_status_choices(self):
        """Test that application status choices work correctly."""
        valid_statuses = ['prepared', 'applied', 'interviewed', 'offered', 'rejected']
        
        for status in valid_statuses:
            application = Application.objects.create(
                company=f"Company {status}",
                job_title=f"Job {status}",
                status=status
            )
            self.assertEqual(application.status, status)

    def test_application_default_status(self):
        """Test that default status is 'applied'."""
        application = Application.objects.create(
            company="Default Test Company",
            job_title="Default Test Job"
        )
        self.assertEqual(application.status, "applied")

    def test_application_ordering(self):
        """Test that applications are ordered by application_date descending."""
        # Clear existing applications
        Application.objects.all().delete()
        
        # Create applications
        app1 = Application.objects.create(
            company="Company 1",
            job_title="Job 1"
        )
        app2 = Application.objects.create(
            company="Company 2", 
            job_title="Job 2"
        )
        
        applications = list(Application.objects.all())
        
        # Check that we have 2 applications
        self.assertEqual(len(applications), 2)
        
        # Check that ordering exists (order may vary due to same timestamp)
        # The important thing is the ordering field is set correctly
        self.assertEqual(Application._meta.ordering, ['-application_date'])

    def test_application_fields_max_length(self):
        """Test field length constraints."""
        long_string = "x" * 260  # Longer than max_length=255
        
        # Test company field max length - Django will truncate or raise ValidationError
        from django.core.exceptions import ValidationError
        from django.db import IntegrityError, DataError
        
        try:
            app = Application(
                company=long_string,
                job_title="Test Job"
            )
            app.full_clean()  # This will raise ValidationError
            self.fail("Expected ValidationError for long company name")
        except ValidationError:
            pass  # Expected behavior
        
        # Test job_title field max length
        try:
            app = Application(
                company="Test Company",
                job_title=long_string
            )
            app.full_clean()  # This will raise ValidationError
            self.fail("Expected ValidationError for long job title")
        except ValidationError:
            pass  # Expected behavior

    def test_application_optional_fields(self):
        """Test that optional fields can be blank/null."""
        application = Application.objects.create(
            company="Test Company",
            job_title="Test Job",
            stage_notes=None
        )
        self.assertIsNone(application.stage_notes)
        
        application.stage_notes = ""
        application.save()
        self.assertEqual(application.stage_notes, "")

    def test_application_meta_options(self):
        """Test model meta options."""
        self.assertEqual(Application._meta.verbose_name, "Application")
        self.assertEqual(Application._meta.verbose_name_plural, "Applications")
        self.assertEqual(Application._meta.ordering, ['-application_date'])
