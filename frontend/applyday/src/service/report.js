import axios from "axios";
import API_CONFIG from '../config/api';

const API_BASE_URL = API_CONFIG.REPORT_API;

export const getReport = async (reportId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${reportId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

export const createReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const deleteReport = async (reportId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${reportId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};


export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// 单独的 extract 功能 - 处理提取任务
export const processExtract = async (startDate, endDate) => {
  try {
    const response = await axios.post(`${API_BASE_URL}extract/`, {
      start: startDate,
      end: endDate
    });
    return response.data;
  } catch (error) {
    console.error("Error processing extract:", error);
    throw error;
  }
};


export const generatePipeline = async (data) => {
  try {
    console.log("Sending pipeline request with data:", data);
    const response = await axios.post(`${API_BASE_URL}run/`, data);
    console.log("Pipeline response received:", response);
    console.log("Pipeline response data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in generatePipeline:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

export const createSummary = async (reportId, resumeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${reportId}/insight/`, { resume_id: resumeId });
    return response.data;
  } catch (error) {
    console.error("Error creating summary:", error);
    throw error;
  }
}
