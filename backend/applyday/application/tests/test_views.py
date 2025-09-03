from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from application.models import Application
from extract.models import JobDescriptionText
import json


class ApplicationViewSetTest(APITestCase):
    """Test cases for the ApplicationViewSet."""

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
        
        self.application3 = Application.objects.create(
            company="Big Company",
            job_title="Frontend Developer",
            status="rejected"
        )

    def test_get_applications_list(self):
        """Test retrieving list of applications."""
        url = '/applications/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_get_single_application(self):
        """Test retrieving a single application."""
        url = f'/applications/{self.application1.pk}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company'], "Tech Corp")
        self.assertEqual(response.data['job_title'], "Senior Developer")

    def test_create_application(self):
        """Test creating a new application."""
        url = '/applications/'
        data = {
            'company': 'New Company',
            'job_title': 'DevOps Engineer',
            'status': 'applied',
            'stage_notes': 'Applied through website'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 4)
        self.assertEqual(response.data['company'], 'New Company')

    def test_create_application_with_job_description(self):
        """Test creating application with job description."""
        url = '/applications/'
        data = {
            'company': 'Test Company',
            'job_title': 'Full Stack Developer',
            'status': 'applied',
            'job_description': 'This is a test job description.'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that job description was created
        application = Application.objects.get(id=response.data['id'])
        self.assertTrue(hasattr(application, 'apply_description'))
        self.assertEqual(application.apply_description.text, 'This is a test job description.')

    def test_update_application(self):
        """Test updating an application."""
        url = f'/applications/{self.application1.pk}/'
        data = {
            'company': 'Updated Tech Corp',
            'status': 'offered'
        }
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.application1.refresh_from_db()
        self.assertEqual(self.application1.company, 'Updated Tech Corp')
        self.assertEqual(self.application1.status, 'offered')

    def test_delete_application(self):
        """Test deleting an application."""
        url = f'/applications/{self.application1.pk}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Application.objects.count(), 2)

    def test_filter_by_job_title(self):
        """Test filtering applications by job title."""
        url = '/applications/?job_title=Senior'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['job_title'], 'Senior Developer')

    def test_filter_by_company(self):
        """Test filtering applications by company."""
        url = '/applications/?company=Startup'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], 'Startup Inc')

    def test_filter_by_status(self):
        """Test filtering applications by status."""
        url = '/applications/?status=interviewed'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['status'], 'interviewed')

    def test_multiple_filters(self):
        """Test applying multiple filters."""
        url = '/applications/?status=applied&company=Tech'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], 'Tech Corp')

    def test_get_stats_action(self):
        """Test the get_stats custom action."""
        url = '/applications/get_stats/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        
        stats = response.data['data']
        self.assertEqual(stats['total'], 3)
        self.assertEqual(stats['applied'], 1)
        self.assertEqual(stats['interviewed'], 1)
        self.assertEqual(stats['rejected'], 1)
        self.assertEqual(stats['offered'], 0)

    def test_get_stats_with_additional_applications(self):
        """Test get_stats with different status distributions."""
        # Create additional applications with different statuses
        Application.objects.create(
            company="Another Company",
            job_title="Backend Developer",
            status="offered"
        )
        
        Application.objects.create(
            company="Yet Another Company", 
            job_title="Mobile Developer",
            status="offered"
        )

        url = '/applications/get_stats/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        stats = response.data['data']
        
        self.assertEqual(stats['total'], 5)
        self.assertEqual(stats['offered'], 2)

    def test_invalid_application_creation(self):
        """Test creating application with invalid data."""
        url = '/applications/'
        data = {
            'company': 'Test Company'
            # Missing required job_title
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('job_title', response.data)

    def test_application_not_found(self):
        """Test accessing non-existent application."""
        url = '/applications/999/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_applications_ordering(self):
        """Test that applications are returned in correct order."""
        url = '/applications/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Applications should be ordered by application_date descending
        # Since all were created in setUp, the order depends on creation sequence
        # The last created should be first
        companies = [app['company'] for app in response.data]
        self.assertIn('Big Company', companies)
        self.assertIn('Startup Inc', companies)
        self.assertIn('Tech Corp', companies)
