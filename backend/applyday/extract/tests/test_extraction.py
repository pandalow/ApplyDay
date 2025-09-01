from django.test import TestCase
from unittest.mock import patch, MagicMock, call
from datetime import datetime
import logging

from extract.models import JobDescriptionText
from extract.services.extraction import (
    build_chain, 
    extract_job_description, 
    process_extract
)


class ExtractionServiceTest(TestCase):
    
    def setUp(self):
        self.sample_jd_text = """
        About the job
        Junior Software Engineer - EasyGo 
        EasyGo are a fast-growing Irish company at the forefront of the electric vehicle (EV) revolution.
        Required Qualifications: 
        Bachelor's degree in Computer Science, Engineering, or related field 
        1–3 years of experience in a software development role 
        What We Offer 
        €40k - €45k plus 10% Bonus 
        """
        
    @patch('extract.services.extraction.os.getenv')
    @patch('extract.services.extraction.ChatOpenAI')
    @patch('extract.services.extraction.PydanticOutputParser')
    @patch('extract.services.extraction.PromptTemplate')
    def test_build_chain_success(self, mock_prompt_template, mock_parser, mock_chat_openai, mock_getenv):
        """Test successful chain building"""
        # Mock environment variable
        mock_getenv.return_value = 'fake-api-key'
        
        # Mock prompt template
        mock_prompt_instance = MagicMock()
        mock_prompt_template.return_value = mock_prompt_instance
        
        # Mock parser
        mock_parser_instance = MagicMock()
        mock_parser_instance.get_format_instructions.return_value = "format instructions"
        mock_parser.return_value = mock_parser_instance
        
        # Mock ChatOpenAI
        mock_model = MagicMock()
        mock_chat_openai.return_value = mock_model
        
        # Mock chain (prompt | model | parser)
        mock_chain = MagicMock()
        mock_prompt_instance.__or__ = MagicMock()
        mock_prompt_instance.__or__.return_value.__or__ = MagicMock()
        mock_prompt_instance.__or__.return_value.__or__.return_value = mock_chain
        
        result = build_chain()
        
        self.assertIsNotNone(result)
        mock_parser.assert_called_once()
        mock_prompt_template.assert_called_once()
        mock_chat_openai.assert_called_once_with(model="gpt-4o-mini", temperature=0)
        
    @patch('extract.services.extraction.os.getenv')
    @patch('extract.services.extraction.sys.exit')
    def test_build_chain_failure(self, mock_exit, mock_getenv):
        """Test chain building failure"""
        mock_getenv.return_value = None  # No API key
        
        with patch('extract.services.extraction.PydanticOutputParser', side_effect=Exception("Parser error")):
            build_chain()
            mock_exit.assert_called_once_with(1)
            
    def test_extract_job_description_success(self):
        """Test successful job description extraction"""
        # Mock chain
        mock_chain = MagicMock()
        
        # Mock JobSchema response
        mock_job_schema = MagicMock()
        mock_job_schema.dict.return_value = {
            'title': 'Junior Software Engineer',
            'company': 'EasyGo',
            'level': 'junior',
            'skills': ['Python', 'JavaScript']
        }
        mock_chain.invoke.return_value = mock_job_schema
        
        result = extract_job_description(mock_chain, self.sample_jd_text)
        
        self.assertEqual(result, mock_job_schema)
        mock_chain.invoke.assert_called_once_with({"jd_text": self.sample_jd_text})
        
    @patch('extract.services.extraction.sys.exit')
    def test_extract_job_description_failure(self, mock_exit):
        """Test job description extraction failure"""
        # Mock chain that raises exception
        mock_chain = MagicMock()
        mock_chain.invoke.side_effect = Exception("Extraction error")
        
        extract_job_description(mock_chain, self.sample_jd_text)
        
        mock_exit.assert_called_once_with(1)
        
    @patch('extract.services.extraction.build_chain')
    @patch('extract.services.extraction.extract_job_description')
    def test_process_extract_no_date_filter(self, mock_extract, mock_build_chain):
        """Test process_extract without date filtering"""
        # Create test job descriptions
        job1 = JobDescriptionText.objects.create(text="Job 1")
        job2 = JobDescriptionText.objects.create(text="Job 2")
        
        # Mock chain and extraction results
        mock_chain = MagicMock()
        mock_build_chain.return_value = mock_chain
        
        mock_job_schema = MagicMock()
        mock_job_schema.model_dump.return_value = {
            'title': 'Test Job',
            'company': 'Test Company'
        }
        mock_extract.return_value = mock_job_schema
        
        with patch('extract.services.extraction.JobDescription') as mock_job_description:
            process_extract(start=None, end=None)
            
            # Verify all jobs were processed
            self.assertEqual(mock_extract.call_count, 2)
            mock_extract.assert_has_calls([
                call(mock_chain, job1.text),
                call(mock_chain, job2.text)
            ])
            
            # Verify JobDescription objects were created
            self.assertEqual(mock_job_description.objects.create.call_count, 2)
            
    @patch('extract.services.extraction.build_chain')
    @patch('extract.services.extraction.extract_job_description')
    def test_process_extract_with_date_filter(self, mock_extract, mock_build_chain):
        """Test process_extract with date filtering"""
        # Create test job descriptions
        job1 = JobDescriptionText.objects.create(text="Job 1")
        job2 = JobDescriptionText.objects.create(text="Job 2")
        
        # Mock chain and extraction results
        mock_chain = MagicMock()
        mock_build_chain.return_value = mock_chain
        
        mock_job_schema = MagicMock()
        mock_job_schema.model_dump.return_value = {
            'title': 'Test Job',
            'company': 'Test Company'
        }
        mock_extract.return_value = mock_job_schema
        
        start_date = "2023-01-01T00:00:00"
        end_date = "2023-12-31T23:59:59"
        
        with patch('extract.services.extraction.JobDescription') as mock_job_description:
            with patch.object(JobDescriptionText.objects, 'filter') as mock_filter:
                mock_queryset = MagicMock()
                mock_queryset.count.return_value = 1
                mock_queryset.__iter__.return_value = iter([job1])
                mock_filter.return_value = mock_queryset
                
                process_extract(start=start_date, end=end_date)
                
                # Verify date filtering was applied
                mock_filter.assert_called_once()
                filter_args = mock_filter.call_args[1]
                self.assertIn('created_at__range', filter_args)
                
                # Verify extraction was called
                mock_extract.assert_called_once_with(mock_chain, job1.text)
                mock_job_description.objects.create.assert_called_once()
                
    @patch('extract.services.extraction.logger')
    def test_process_extract_logging(self, mock_logger):
        """Test that process_extract logs correctly"""
        JobDescriptionText.objects.create(text="Job 1")
        
        with patch('extract.services.extraction.build_chain') as mock_build_chain:
            with patch('extract.services.extraction.extract_job_description') as mock_extract:
                with patch('extract.services.extraction.JobDescription'):
                    mock_chain = MagicMock()
                    mock_build_chain.return_value = mock_chain
                    
                    mock_job_schema = MagicMock()
                    mock_job_schema.model_dump.return_value = {}
                    mock_extract.return_value = mock_job_schema
                    
                    process_extract(start=None, end=None)
                    
                    # Verify logging was called
                    mock_logger.info.assert_called_with("Found %s job descriptions", 1)
