from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from application.models import Application
from application.serializers import ApplicationSerializer
from extract.models import JobDescriptionText


class ApplicationSerializerTest(TestCase):
    """Test cases for the ApplicationSerializer."""

    def setUp(self):
        """Set up test data."""
        self.application_data = {
            'company': 'Test Company',
            'job_title': 'Software Engineer',
            'status': 'applied',
            'stage_notes': 'Test notes'
        }
        
        self.application = Application.objects.create(
            company="Existing Company",
            job_title="Existing Job",
            status="applied"
        )

    def test_serialize_application(self):
        """Test serializing an application instance."""
        serializer = ApplicationSerializer(instance=self.application)
        data = serializer.data
        
        self.assertEqual(data['company'], "Existing Company")
        self.assertEqual(data['job_title'], "Existing Job")
        self.assertEqual(data['status'], "applied")
        self.assertIn('id', data)
        self.assertIn('application_date', data)

    def test_deserialize_application(self):
        """Test deserializing application data."""
        serializer = ApplicationSerializer(data=self.application_data)
        self.assertTrue(serializer.is_valid())
        
        application = serializer.save()
        self.assertEqual(application.company, 'Test Company')
        self.assertEqual(application.job_title, 'Software Engineer')
        self.assertEqual(application.status, 'applied')
        self.assertEqual(application.stage_notes, 'Test notes')

    def test_serializer_validation(self):
        """Test serializer validation."""
        # Test with missing required fields
        invalid_data = {'company': 'Test Company'}  # Missing job_title
        serializer = ApplicationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('job_title', serializer.errors)

    def test_create_with_job_description(self):
        """Test creating application with job description."""
        data_with_jd = self.application_data.copy()
        data_with_jd['job_description'] = "This is a test job description."
        
        serializer = ApplicationSerializer(data=data_with_jd)
        self.assertTrue(serializer.is_valid())
        
        application = serializer.save()
        self.assertTrue(hasattr(application, 'apply_description'))
        self.assertEqual(application.apply_description.text, "This is a test job description.")

    def test_update_with_job_description(self):
        """Test updating application with job description."""
        # First create job description for existing application
        JobDescriptionText.objects.create(
            application=self.application,
            text="Original job description"
        )
        
        update_data = {
            'job_description': 'Updated job description'
        }
        
        serializer = ApplicationSerializer(
            instance=self.application, 
            data=update_data, 
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_application = serializer.save()
        self.assertEqual(
            updated_application.apply_description.text, 
            'Updated job description'
        )

    def test_update_creates_job_description_if_not_exists(self):
        """Test that update creates job description if it doesn't exist."""
        update_data = {
            'job_description': 'New job description'
        }
        
        serializer = ApplicationSerializer(
            instance=self.application,
            data=update_data,
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_application = serializer.save()
        self.assertTrue(hasattr(updated_application, 'apply_description'))
        self.assertEqual(
            updated_application.apply_description.text,
            'New job description'
        )

    def test_serializer_read_only_fields(self):
        """Test that read-only fields cannot be updated."""
        update_data = {
            'id': 999,  # This should be ignored
            'company': 'Updated Company'
        }
        
        original_id = self.application.id
        serializer = ApplicationSerializer(
            instance=self.application,
            data=update_data,
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_application = serializer.save()
        self.assertEqual(updated_application.id, original_id)  # ID unchanged
        self.assertEqual(updated_application.company, 'Updated Company')  # Company updated

    def test_apply_description_in_serialized_data(self):
        """Test that apply_description is included in serialized data."""
        # Create job description for the application
        JobDescriptionText.objects.create(
            application=self.application,
            text="Test job description"
        )
        
        serializer = ApplicationSerializer(instance=self.application)
        data = serializer.data
        
        self.assertIn('apply_description', data)
        self.assertEqual(data['apply_description']['text'], "Test job description")

    def test_job_description_write_only(self):
        """Test that job_description field is write-only."""
        data_with_jd = self.application_data.copy()
        data_with_jd['job_description'] = "Test job description"
        
        serializer = ApplicationSerializer(data=data_with_jd)
        self.assertTrue(serializer.is_valid())
        
        application = serializer.save()
        serialized_data = ApplicationSerializer(instance=application).data
        
        # job_description should not appear in serialized data
        self.assertNotIn('job_description', serialized_data)
