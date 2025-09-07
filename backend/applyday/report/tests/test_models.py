from django.test import TestCase
from django.utils import timezone
from application.models import Application
from extract.models import JobDescriptionText


class JobDescriptionTextModelTest(TestCase):
    """Test cases for the JobDescriptionText model."""

    def setUp(self):
        """Set up test data."""
        self.application = Application.objects.create(
            company="Test Company",
            job_title="Software Engineer",
            status="applied"
        )
        
        self.job_description = JobDescriptionText.objects.create(
            application=self.application,
            text="This is a test job description with requirements and responsibilities."
        )

    def test_create_job_description_text(self):
        """Test creating a new job description text."""
        self.assertEqual(self.job_description.application, self.application)
        self.assertEqual(
            self.job_description.text, 
            "This is a test job description with requirements and responsibilities."
        )
        self.assertIsNotNone(self.job_description.created_at)
        
    def test_job_description_text_created_at_auto_set(self):
        """Test that created_at is automatically set."""
        before_creation = timezone.now()
        
        # Create a new application for this test
        new_app = Application.objects.create(
            company="New Company",
            job_title="New Job",
            status="applied"
        )
        
        jd_text = JobDescriptionText.objects.create(
            application=new_app,
            text="Another test job description"
        )
        after_creation = timezone.now()
        
        self.assertGreaterEqual(jd_text.created_at, before_creation)
        self.assertLessEqual(jd_text.created_at, after_creation)

    def test_job_description_text_without_application(self):
        """Test creating job description text without application."""
        jd_text = JobDescriptionText.objects.create(
            text="Job description without application"
        )
        self.assertIsNone(jd_text.application)
        self.assertEqual(jd_text.text, "Job description without application")

    def test_one_to_one_relationship(self):
        """Test the OneToOne relationship with Application."""
        # Access job description through application
        self.assertEqual(self.application.apply_description, self.job_description)
        
        # Test related name
        self.assertEqual(
            self.application.apply_description.text,
            "This is a test job description with requirements and responsibilities."
        )

    def test_application_cascade_behavior(self):
        """Test SET_NULL behavior when application is deleted."""
        # Create another application and job description
        another_app = Application.objects.create(
            company="Another Company",
            job_title="Another Job"
        )
        
        another_jd = JobDescriptionText.objects.create(
            application=another_app,
            text="Another job description"
        )
        
        # Delete the application
        another_app.delete()
        
        # Job description should still exist but application should be None
        another_jd.refresh_from_db()
        self.assertIsNone(another_jd.application)
        self.assertEqual(another_jd.text, "Another job description")

    def test_job_description_text_str_representation(self):
        """Test string representation of JobDescriptionText."""
        # Since no __str__ method is defined, it should use default
        str_repr = str(self.job_description)
        self.assertIn("JobDescriptionText", str_repr)

    def test_text_field_can_handle_long_text(self):
        """Test that text field can handle long job descriptions."""
        long_text = "This is a very long job description. " * 100
        
        # Create a new application for this test
        long_app = Application.objects.create(
            company="Long Company",
            job_title="Long Job",
            status="applied"
        )
        
        long_jd = JobDescriptionText.objects.create(
            application=long_app,
            text=long_text
        )
        
        self.assertEqual(long_jd.text, long_text)
        self.assertEqual(len(long_jd.text), len(long_text))

    def test_multiple_job_descriptions_different_applications(self):
        """Test creating multiple job descriptions for different applications."""
        app1 = Application.objects.create(
            company="Company 1",
            job_title="Job 1"
        )
        
        app2 = Application.objects.create(
            company="Company 2", 
            job_title="Job 2"
        )
        
        jd1 = JobDescriptionText.objects.create(
            application=app1,
            text="Job description 1"
        )
        
        jd2 = JobDescriptionText.objects.create(
            application=app2,
            text="Job description 2"
        )
        
        self.assertEqual(app1.apply_description, jd1)
        self.assertEqual(app2.apply_description, jd2)
        self.assertEqual(JobDescriptionText.objects.count(), 3)  # Including setUp one

    def test_job_description_fields_are_correct_type(self):
        """Test that model fields have correct types."""
        # Check field types through model meta
        application_field = JobDescriptionText._meta.get_field('application')
        text_field = JobDescriptionText._meta.get_field('text')
        created_at_field = JobDescriptionText._meta.get_field('created_at')
        
        self.assertEqual(application_field.__class__.__name__, 'OneToOneField')
        self.assertEqual(text_field.__class__.__name__, 'TextField')
        self.assertEqual(created_at_field.__class__.__name__, 'DateTimeField')
        
        # Check OneToOneField properties
        self.assertTrue(application_field.null)
        self.assertTrue(application_field.blank)
        self.assertEqual(application_field.related_model, Application)
