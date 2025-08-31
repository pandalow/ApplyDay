from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date
from .models import Application
from .serializers import ApplicationSerializer


class ApplicationModelTestCase(TestCase):
    """Test the Application model functionality"""

    def setUp(self):
        """Set up test data"""
        self.application_data = {
            'company': 'Test Company',
            'job_title': 'Software Developer',
            'job_description': 'A test job description',
            'status': 'applied',
            'stage_notes': 'Initial application submitted'
        }
        self.application = Application.objects.create(**self.application_data)
    
    def test_application_creation(self):
        """Test that the Application object is created correctly"""
        self.assertTrue(isinstance(self.application, Application))
        self.assertEqual(self.application.company, 'Test Company')
        self.assertEqual(self.application.job_title, 'Software Developer')
        self.assertEqual(self.application.status, 'applied')
        self.assertIsNotNone(self.application.application_date)
    
    def test_string_representation(self):
        """Test the string representation of the model"""
        expected_str = f"{self.application.job_title} at {self.application.company}"
        self.assertEqual(str(self.application), expected_str)
        self.assertEqual(str(self.application), "Software Developer at Test Company")
    
    def test_application_date_auto_creation(self):
        """Test that the application_date field is automatically set"""
        self.assertEqual(self.application.application_date, date.today())
    
    def test_status_choices(self):
        """Test the validity of status choices"""
        valid_statuses = ['applied', 'interviewed', 'offered', 'rejected']
        for status_choice in valid_statuses:
            app = Application(
                company='Test',
                job_title='Test Job',
                status=status_choice
            )
            app.full_clean()  # Should not raise ValidationError

    def test_optional_fields(self):
        """Test that optional fields can be omitted"""
        minimal_app = Application.objects.create(
            company='Minimal Company',
            job_title='Minimal Job'
        )
        self.assertIsNone(minimal_app.job_description)
        self.assertIsNone(minimal_app.stage_notes)
        self.assertEqual(minimal_app.status, 'applied')  # 默认状态
    
    def test_model_ordering(self):
        """Test the default ordering of the model"""
        # Create another application record
        older_app = Application.objects.create(
            company='Older Company',
            job_title='Older Job'
        )
        # Modify the creation date to make it appear earlier
        older_app.application_date = date(2024, 1, 1)
        older_app.save()
        
        applications = Application.objects.all()
        # Default ordering should be by application_date descending
        self.assertEqual(applications[0], self.application)
        self.assertEqual(applications[1], older_app)


class ApplicationSerializerTestCase(TestCase):
    """Test the ApplicationSerializer functionality"""

    def setUp(self):
        """Set up test data"""
        self.application_data = {
            'company': 'Serializer Test Company',
            'job_title': 'Backend Developer',
            'job_description': 'Django development position',
            'status': 'interviewed',
            'stage_notes': 'First round completed'
        }
        self.application = Application.objects.create(**self.application_data)
    
    def test_serialization(self):
        """Test serialization functionality"""
        serializer = ApplicationSerializer(instance=self.application)
        data = serializer.data
        
        self.assertEqual(data['company'], 'Serializer Test Company')
        self.assertEqual(data['job_title'], 'Backend Developer')
        self.assertEqual(data['status'], 'interviewed')
        self.assertIn('id', data)
        self.assertIn('application_date', data)
    
    def test_deserialization_valid_data(self):
        """Test deserialization of valid data"""
        valid_data = {
            'company': 'New Company',
            'job_title': 'Frontend Developer',
            'job_description': 'React development',
            'status': 'applied',
            'stage_notes': 'Application sent'
        }
        serializer = ApplicationSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        
        application = serializer.save()
        self.assertEqual(application.company, 'New Company')
        self.assertEqual(application.job_title, 'Frontend Developer')
    
    def test_deserialization_invalid_data(self):
        """Test deserialization of invalid data"""
        invalid_data = {
            'job_title': 'Missing Company Field',
            # company 字段缺失
            'status': 'invalid_status'  # 无效状态
        }
        serializer = ApplicationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('company', serializer.errors)
    
    def test_read_only_fields(self):
        """Test read-only fields"""
        data_with_readonly = {
            'id': 999,  # Read-only field
            'application_date': '2030-01-01',  # Read-only field
            'company': 'Updated Company',
            'job_title': 'Updated Job',
            'status': 'offered'
        }
        serializer = ApplicationSerializer(
            instance=self.application, 
            data=data_with_readonly, 
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_application = serializer.save()
        # Read-only fields should not be updated
        self.assertNotEqual(updated_application.id, 999)
        self.assertNotEqual(updated_application.application_date, date(2030, 1, 1))
        # Non-read-only fields should be updated
        self.assertEqual(updated_application.company, 'Updated Company')


class ApplicationViewSetTestCase(APITestCase):
    """Test the ApplicationViewSet API endpoints"""
    
    def setUp(self):
        """Set up test data and client"""
        self.client = APIClient()

        # Create test data
        self.application1 = Application.objects.create(
            company='Google',
            job_title='Software Engineer',
            job_description='Backend development',
            status='applied',
            stage_notes='Applied online'
        )
        
        self.application2 = Application.objects.create(
            company='Microsoft',
            job_title='Frontend Developer',
            job_description='React development',
            status='interviewed',
            stage_notes='Phone interview completed'
        )
        
        self.application3 = Application.objects.create(
            company='Amazon',
            job_title='DevOps Engineer',
            job_description='AWS infrastructure',
            status='rejected',
            stage_notes='Not selected for next round'
        )
        
        # API endpoints
        self.list_url = reverse('application-list')
        self.detail_url = lambda pk: reverse('application-detail', kwargs={'pk': pk})
        self.stats_url = reverse('application-get-stats')
    
    def test_get_application_list(self):
        """Test getting the application list"""
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check for pagination, use results if present, otherwise use data
        if 'results' in response.data:
            self.assertEqual(len(response.data['results']), 3)
        else:
            self.assertEqual(len(response.data), 3)
    
    def test_get_application_detail(self):
        """Test getting a single application detail"""
        response = self.client.get(self.detail_url(self.application1.pk))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company'], 'Google')
        self.assertEqual(response.data['job_title'], 'Software Engineer')
    
    def test_create_application(self):
        """Test creating a new application (POST)"""
        new_application_data = {
            'company': 'Apple',
            'job_title': 'iOS Developer',
            'job_description': 'Swift development',
            'status': 'applied',
            'stage_notes': 'Initial application'
        }
        
        response = self.client.post(self.list_url, new_application_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 4)
        self.assertEqual(response.data['company'], 'Apple')
    
    def test_update_application(self):
        """Test updating an application (PUT)"""
        updated_data = {
            'company': 'Google Updated',
            'job_title': 'Senior Software Engineer',
            'job_description': 'Updated description',
            'status': 'interviewed',
            'stage_notes': 'Updated notes'
        }
        
        response = self.client.put(
            self.detail_url(self.application1.pk), 
            updated_data, 
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.application1.refresh_from_db()
        self.assertEqual(self.application1.company, 'Google Updated')
        self.assertEqual(self.application1.status, 'interviewed')
    
    def test_partial_update_allowed_fields(self):
        """Test partial update of allowed fields"""
        partial_data = {
            'status': 'offered',
            'stage_notes': 'Got the offer!'
        }
        
        response = self.client.patch(
            self.detail_url(self.application1.pk), 
            partial_data, 
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.application1.refresh_from_db()
        self.assertEqual(self.application1.status, 'offered')
        self.assertEqual(self.application1.stage_notes, 'Got the offer!')
    
    def test_partial_update_restricted_fields(self):
        """Test partial update of restricted fields"""
        restricted_data = {
            'company': 'Should not be updated',  # Not in allowed fields
            'status': 'offered'
        }
        
        response = self.client.patch(
            self.detail_url(self.application1.pk), 
            restricted_data, 
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Invalid fields', response.data['error'])
    
    def test_delete_application(self):
        """Test deleting an application"""
        response = self.client.delete(self.detail_url(self.application1.pk))
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Application.objects.count(), 2)
        self.assertFalse(Application.objects.filter(pk=self.application1.pk).exists())
    
    def test_filter_by_job_title(self):
        """Test filtering by job title"""
        response = self.client.get(self.list_url, {'job_title': 'Engineer'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return two positions containing 'Engineer'
        if 'results' in response.data:
            self.assertEqual(len(response.data['results']), 2)
        else:
            self.assertEqual(len(response.data), 2)
    
    def test_filter_by_company(self):
        """Test filtering by company name"""
        response = self.client.get(self.list_url, {'company': 'google'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'results' in response.data:
            results = response.data['results']
            self.assertEqual(len(results), 1)
            self.assertEqual(results[0]['company'], 'Google')
        else:
            self.assertEqual(len(response.data), 1)
            self.assertEqual(response.data[0]['company'], 'Google')
    
    def test_filter_by_status(self):
        """Test filtering by status"""
        response = self.client.get(self.list_url, {'status': 'interviewed'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if 'results' in response.data:
            results = response.data['results']
            self.assertEqual(len(results), 1)
            self.assertEqual(results[0]['status'], 'interviewed')
        else:
            self.assertEqual(len(response.data), 1)
            self.assertEqual(response.data[0]['status'], 'interviewed')
    
    def test_get_stats(self):
        """Test getting application statistics"""
        response = self.client.get(self.stats_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_applications', response.data)
        
        stats = response.data['total_applications']
        self.assertEqual(stats['total'], 3)
        self.assertEqual(stats['applied'], 1)
        self.assertEqual(stats['interviewed'], 1)
        self.assertEqual(stats['rejected'], 1)
        self.assertEqual(stats['offered'], 0)
    
    def test_nonexistent_application(self):
        """Test accessing a nonexistent application"""
        response = self.client.get(self.detail_url(999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


