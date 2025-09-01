from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from datetime import datetime
import json

from extract.models import JobDescriptionText
from extract.serializers import JobExtractSerializer


class JobExtractViewSetTest(APITestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.job_desc = JobDescriptionText.objects.create(text="Sample job description")
        
        # URL patterns based on actual URL configuration
        self.list_url = '/extract/'  # Based on router configuration
        self.detail_url = f'/extract/{self.job_desc.pk}/'
        
    def test_list_job_descriptions(self):
        """Test GET request to list all job descriptions"""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        
    def test_create_job_description(self):
        """Test POST request to create new job description"""
        data = {'text': 'New job description content'}
        response = self.client.post(self.list_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['text'], data['text'])
        self.assertTrue(JobDescriptionText.objects.filter(text=data['text']).exists())
        
    def test_retrieve_job_description(self):
        """Test GET request to retrieve specific job description"""
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], self.job_desc.text)
        
    def test_partial_update_valid_fields(self):
        """Test PATCH request with valid fields"""
        data = {'text': 'Updated job description'}
        response = self.client.patch(self.detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], data['text'])
        
        # Verify database was updated
        self.job_desc.refresh_from_db()
        self.assertEqual(self.job_desc.text, data['text'])
        
    def test_partial_update_invalid_fields(self):
        """Test PATCH request with invalid fields"""
        data = {'invalid_field': 'some value', 'another_invalid': 'another value'}
        response = self.client.patch(self.detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Invalid fields', response.data['error'])
        
    def test_partial_update_mixed_fields(self):
        """Test PATCH request with mix of valid and invalid fields"""
        data = {'text': 'Updated text', 'invalid_field': 'some value'}
        response = self.client.patch(self.detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch('extract.views.process_extract')
    def test_process_extract_action_success(self, mock_process_extract):
        """Test successful process_extract action"""
        mock_process_extract.return_value = None
        
        url = '/extract/process_extract/'
        data = {
            'start': '2023-01-01T00:00:00',
            'end': '2023-12-31T23:59:59'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Extraction completed')
        mock_process_extract.assert_called_once_with(
            start=data['start'],
            end=data['end']
        )
        
    @patch('extract.views.process_extract')
    def test_process_extract_action_missing_start(self, mock_process_extract):
        """Test process_extract action with missing start parameter"""
        url = '/extract/process_extract/'
        data = {'end': '2023-12-31T23:59:59'}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('required', response.data['error'])
        mock_process_extract.assert_not_called()
        
    @patch('extract.views.process_extract')
    def test_process_extract_action_missing_end(self, mock_process_extract):
        """Test process_extract action with missing end parameter"""
        url = '/extract/process_extract/'
        data = {'start': '2023-01-01T00:00:00'}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('required', response.data['error'])
        mock_process_extract.assert_not_called()
        
    @patch('extract.views.process_extract')
    def test_process_extract_action_invalid_datetime_format(self, mock_process_extract):
        """Test process_extract action with invalid datetime format"""
        url = '/extract/process_extract/'
        data = {
            'start': 'invalid-datetime',
            'end': '2023-12-31T23:59:59'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Invalid datetime format', response.data['error'])
        mock_process_extract.assert_not_called()
        
    def test_delete_job_description(self):
        """Test DELETE request to remove job description"""
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(JobDescriptionText.objects.filter(pk=self.job_desc.pk).exists())
        
    def test_update_job_description(self):
        """Test PUT request to update job description"""
        data = {'text': 'Completely updated job description'}
        response = self.client.put(self.detail_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], data['text'])
        
        # Verify database was updated
        self.job_desc.refresh_from_db()
        self.assertEqual(self.job_desc.text, data['text'])
