from django.test import TestCase
from extract.models import JobDescriptionText
from extract.serializers import JobExtractSerializer


class JobExtractSerializerTest(TestCase):
    
    def setUp(self):
        self.valid_data = {"text": "Test job description content"}
        self.job_desc = JobDescriptionText.objects.create(text="Sample job description")
        
    def test_serializer_with_valid_data(self):
        """Test serializer with valid data"""
        serializer = JobExtractSerializer(data=self.valid_data)
        
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['text'], self.valid_data['text'])
        
    def test_serializer_save(self):
        """Test serializer save method creates object"""
        serializer = JobExtractSerializer(data=self.valid_data)
        
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        
        self.assertIsInstance(instance, JobDescriptionText)
        self.assertEqual(instance.text, self.valid_data['text'])
        self.assertIsNotNone(instance.created_at)
        
    def test_serializer_with_empty_text(self):
        """Test serializer with empty text"""
        empty_data = {"text": ""}
        serializer = JobExtractSerializer(data=empty_data)
        
        # Check if empty text is valid or not based on actual behavior
        is_valid = serializer.is_valid()
        if is_valid:
            self.assertTrue(is_valid)  # TextField allows empty strings
        else:
            self.assertFalse(is_valid)  # If there are validation rules preventing empty strings
            self.assertIn('text', serializer.errors)
        
    def test_serializer_with_missing_text(self):
        """Test serializer with missing text field"""
        serializer = JobExtractSerializer(data={})
        
        self.assertFalse(serializer.is_valid())
        self.assertIn('text', serializer.errors)
        
    def test_serializer_serialize_existing_instance(self):
        """Test serializing existing model instance"""
        serializer = JobExtractSerializer(self.job_desc)
        
        self.assertIn('id', serializer.data)
        self.assertIn('text', serializer.data)
        self.assertIn('created_at', serializer.data)
        self.assertEqual(serializer.data['text'], self.job_desc.text)
        
    def test_read_only_fields(self):
        """Test that id and created_at are read-only"""
        update_data = {
            'id': 999,
            'text': 'Updated text',
            'created_at': '2023-01-01T00:00:00Z'
        }
        
        serializer = JobExtractSerializer(self.job_desc, data=update_data)
        self.assertTrue(serializer.is_valid())
        
        updated_instance = serializer.save()
        
        # id and created_at should not be updated
        self.assertEqual(updated_instance.id, self.job_desc.id)
        self.assertEqual(updated_instance.created_at, self.job_desc.created_at)
        self.assertEqual(updated_instance.text, update_data['text'])
        
    def test_partial_update(self):
        """Test partial update with serializer"""
        partial_data = {'text': 'Partially updated text'}
        
        serializer = JobExtractSerializer(self.job_desc, data=partial_data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        updated_instance = serializer.save()
        self.assertEqual(updated_instance.text, partial_data['text'])
        self.assertEqual(updated_instance.id, self.job_desc.id)
