from django.test import TestCase
from django.utils import timezone
from extract.models import JobDescriptionText


class JobDescriptionTextModelTest(TestCase):
    
    def setUp(self):
        self.sample_text = "Test job description content"
        
    def test_create_job_description_text(self):
        """Test creating a JobDescriptionText instance"""
        job_desc = JobDescriptionText.objects.create(text=self.sample_text)
        
        self.assertEqual(job_desc.text, self.sample_text)
        self.assertIsNotNone(job_desc.created_at)
        self.assertTrue(isinstance(job_desc.created_at, timezone.datetime))
        
    def test_job_description_text_str_representation(self):
        """Test string representation of JobDescriptionText"""
        job_desc = JobDescriptionText.objects.create(text=self.sample_text)
        
        # Assuming the model doesn't have __str__ method, it will show default
        self.assertIn("JobDescriptionText", str(job_desc))
        
    def test_auto_created_at_field(self):
        """Test that created_at is automatically set"""
        before_creation = timezone.now()
        job_desc = JobDescriptionText.objects.create(text=self.sample_text)
        after_creation = timezone.now()
        
        self.assertTrue(before_creation <= job_desc.created_at <= after_creation)
        
    def test_text_field_max_length(self):
        """Test text field can handle large content"""
        large_text = "A" * 10000  # 10k characters
        job_desc = JobDescriptionText.objects.create(text=large_text)
        
        self.assertEqual(job_desc.text, large_text)
        
    def test_query_ordering(self):
        """Test querying and ordering by created_at"""
        job_desc1 = JobDescriptionText.objects.create(text="First job")
        job_desc2 = JobDescriptionText.objects.create(text="Second job")
        
        # Order by creation time
        jobs = JobDescriptionText.objects.order_by('created_at')
        self.assertEqual(list(jobs), [job_desc1, job_desc2])
        
        # Order by reverse creation time
        jobs_reverse = JobDescriptionText.objects.order_by('-created_at')
        self.assertEqual(list(jobs_reverse), [job_desc2, job_desc1])
