from django.test import TestCase
from rest_framework.test import APITestCase
from application.models import Application
from extract.models import JobDescriptionText
from extract.serializers import JobExtractSerializer


class JobExtractSerializerTest(TestCase):
    """Test cases for the JobExtractSerializer."""

    def setUp(self):
        """Set up test data."""
        self.application = Application.objects.create(
            company="Test Company",
            job_title="Software Engineer",
            status="applied"
        )
        
        self.job_description = JobDescriptionText.objects.create(
            application=self.application,
            text="Test job description text"
        )
        
        self.job_description_data = {
            'application': self.application.id,
            'text': 'New job description text'
        }

    def test_serialize_job_description_text(self):
        """Test serializing a JobDescriptionText instance."""
        serializer = JobExtractSerializer(instance=self.job_description)
        data = serializer.data
        
        self.assertEqual(data['application'], self.application.id)
        self.assertEqual(data['text'], "Test job description text")
        self.assertIn('id', data)
        self.assertIn('created_at', data)

    def test_deserialize_job_description_text(self):
        """Test deserializing job description text data."""
        serializer = JobExtractSerializer(data=self.job_description_data)
        self.assertTrue(serializer.is_valid())
        
        job_description = serializer.save()
        self.assertEqual(job_description.application, self.application)
        self.assertEqual(job_description.text, 'New job description text')

    def test_deserialize_without_application(self):
        """Test deserializing job description without application."""
        data = {
            'text': 'Job description without application'
        }
        
        serializer = JobExtractSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        job_description = serializer.save()
        self.assertIsNone(job_description.application)
        self.assertEqual(job_description.text, 'Job description without application')

    def test_serializer_validation_missing_text(self):
        """Test serializer validation when text is missing."""
        invalid_data = {
            'application': self.application.id
            # Missing required 'text' field
        }
        
        serializer = JobExtractSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('text', serializer.errors)

    def test_serializer_validation_empty_text(self):
        """Test serializer validation with empty text."""
        data = {
            'application': self.application.id,
            'text': ''
        }
        
        serializer = JobExtractSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('text', serializer.errors)

    def test_update_job_description_text(self):
        """Test updating job description text."""
        update_data = {
            'text': 'Updated job description text'
        }
        
        serializer = JobExtractSerializer(
            instance=self.job_description,
            data=update_data,
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_job_description = serializer.save()
        self.assertEqual(updated_job_description.text, 'Updated job description text')
        self.assertEqual(updated_job_description.application, self.application)

    def test_read_only_fields(self):
        """Test that read-only fields cannot be updated."""
        original_created_at = self.job_description.created_at
        original_id = self.job_description.id
        
        update_data = {
            'id': 999,  # This should be ignored
            'created_at': '2023-01-01T00:00:00Z',  # This should be ignored
            'text': 'Updated text'
        }
        
        serializer = JobExtractSerializer(
            instance=self.job_description,
            data=update_data,
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_job_description = serializer.save()
        
        # Read-only fields should remain unchanged
        self.assertEqual(updated_job_description.id, original_id)
        self.assertEqual(updated_job_description.created_at, original_created_at)
        # Non-read-only field should be updated
        self.assertEqual(updated_job_description.text, 'Updated text')

    def test_serializer_all_fields_included(self):
        """Test that all model fields are included in serializer."""
        serializer = JobExtractSerializer(instance=self.job_description)
        data = serializer.data
        
        expected_fields = {'id', 'application', 'text', 'created_at'}
        actual_fields = set(data.keys())
        
        self.assertEqual(actual_fields, expected_fields)

    def test_serializer_with_invalid_application_id(self):
        """Test serializer with non-existent application ID."""
        data = {
            'application': 99999,  # Non-existent application ID
            'text': 'Test job description'
        }
        
        serializer = JobExtractSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('application', serializer.errors)

    def test_serializer_with_long_text(self):
        """Test serializer with very long text."""
        long_text = "This is a very long job description. " * 1000
        
        data = {
            'application': self.application.id,
            'text': long_text
        }
        
        serializer = JobExtractSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        job_description = serializer.save()
        self.assertEqual(job_description.text, long_text)

    def test_serializer_meta_configuration(self):
        """Test serializer meta configuration."""
        serializer = JobExtractSerializer()
        
        # Check model
        self.assertEqual(serializer.Meta.model, JobDescriptionText)
        
        # Check fields
        self.assertEqual(serializer.Meta.fields, '__all__')
        
        # Check read_only_fields
        expected_read_only = ['id', 'created_at']
        self.assertEqual(list(serializer.Meta.read_only_fields), expected_read_only)
