from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime, timezone as dt_timezone
from unittest.mock import patch
from application.models import Application
from extract.models import JobDescriptionText
from extract.views import JobExtract
import json


class JobExtractViewSetTest(APITestCase):
    """Test cases for the JobExtract ViewSet."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        
        # Create test applications
        self.application1 = Application.objects.create(
            company="Tech Corp",
            job_title="Senior Developer",
            status="applied"
        )
        
        self.application2 = Application.objects.create(
            company="Startup Inc", 
            job_title="Junior Developer",
            status="interviewed"
        )
        
        # Create job descriptions
        self.job_desc1 = JobDescriptionText.objects.create(
            application=self.application1,
            text="Senior developer position requiring Python and Django experience."
        )
        
        self.job_desc2 = JobDescriptionText.objects.create(
            application=self.application2,
            text="Junior developer role for fresh graduates with basic programming knowledge."
        )

    def test_get_job_descriptions_list(self):
        """Test retrieving list of job descriptions."""
        url = '/extract/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_single_job_description(self):
        """Test retrieving a single job description."""
        url = f'/extract/{self.job_desc1.pk}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['text'], 
            "Senior developer position requiring Python and Django experience."
        )

    def test_create_job_description(self):
        """Test creating a new job description."""
        url = '/extract/'
        data = {
            'application': self.application1.id,
            'text': 'New job description for testing creation.'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobDescriptionText.objects.count(), 3)

    def test_create_job_description_without_application(self):
        """Test creating job description without application."""
        url = '/extract/'
        data = {
            'text': 'Standalone job description text.'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNone(response.data['application'])

    def test_update_job_description(self):
        """Test updating a job description using PUT."""
        url = f'/extract/{self.job_desc1.pk}/'
        data = {
            'application': self.application1.id,
            'text': 'Updated job description text.'
        }
        
        response = self.client.put(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job_desc1.refresh_from_db()
        self.assertEqual(self.job_desc1.text, 'Updated job description text.')

    def test_partial_update_job_description(self):
        """Test partial update (PATCH) of job description."""
        url = f'/extract/{self.job_desc1.pk}/'
        data = {
            'text': 'Partially updated job description.'
        }
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job_desc1.refresh_from_db()
        self.assertEqual(self.job_desc1.text, 'Partially updated job description.')

    def test_partial_update_invalid_fields(self):
        """Test partial update with invalid fields."""
        url = f'/extract/{self.job_desc1.pk}/'
        data = {
            'invalid_field': 'Some value',
            'text': 'Updated text'
        }
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "Invalid fields for partial update.")

    def test_partial_update_only_text_allowed(self):
        """Test that only 'text' field is allowed in partial update."""
        url = f'/extract/{self.job_desc1.pk}/'
        data = {
            'application': self.application2.id,  # This should not be allowed
            'text': 'Updated text'
        }
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_delete_job_description(self):
        """Test deleting a job description."""
        url = f'/extract/{self.job_desc1.pk}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(JobDescriptionText.objects.count(), 1)

    def test_process_extract_action_valid_dates(self):
        """Test process_extract action with valid date parameters."""
        url = '/extract/process_extract/'
        data = {
            'start': '2024-01-01T00:00:00',
            'end': '2024-12-31T23:59:59'
        }
        
        with patch('extract.services.extraction.process_extract') as mock_process:
            response = self.client.post(url, data, format='json')
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['message'], "Extraction completed")
            
            # Verify that process_extract was called with correct parameters
            mock_process.assert_called_once_with(
                start='2024-01-01T00:00:00',
                end='2024-12-31T23:59:59'
            )

    def test_process_extract_action_missing_start(self):
        """Test process_extract action with missing start parameter."""
        url = '/extract/process_extract/'
        data = {
            'end': '2024-12-31T23:59:59'
            # Missing 'start' parameter
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['error'], 
            "Both 'start' and 'end' are required"
        )

    def test_process_extract_action_missing_end(self):
        """Test process_extract action with missing end parameter."""
        url = '/extract/process_extract/'
        data = {
            'start': '2024-01-01T00:00:00'
            # Missing 'end' parameter
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['error'],
            "Both 'start' and 'end' are required"
        )

    def test_process_extract_action_invalid_start_format(self):
        """Test process_extract action with invalid start date format."""
        url = '/extract/process_extract/'
        data = {
            'start': 'invalid-date-format',
            'end': '2024-12-31T23:59:59'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['error'],
            "Invalid datetime format, must be ISO 8601"
        )

    def test_process_extract_action_invalid_end_format(self):
        """Test process_extract action with invalid end date format."""
        url = '/extract/process_extract/'
        data = {
            'start': '2024-01-01T00:00:00',
            'end': 'invalid-date-format'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['error'],
            "Invalid datetime format, must be ISO 8601"
        )

    def test_job_description_not_found(self):
        """Test accessing non-existent job description."""
        url = '/extract/999/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_job_description_invalid_data(self):
        """Test creating job description with invalid data."""
        url = '/extract/'
        data = {
            'application': self.application1.id
            # Missing required 'text' field
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('text', response.data)

    def test_viewset_queryset(self):
        """Test that viewset returns correct queryset."""
        viewset = JobExtract()
        queryset = viewset.get_queryset()
        
        self.assertEqual(list(queryset), list(JobDescriptionText.objects.all()))
        self.assertEqual(queryset.count(), 2)

    def test_viewset_serializer_class(self):
        """Test that viewset uses correct serializer."""
        viewset = JobExtract()
        
        from extract.serializers import JobExtractSerializer
        self.assertEqual(viewset.serializer_class, JobExtractSerializer)
