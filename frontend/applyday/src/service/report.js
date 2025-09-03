import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000';

export const fetchJDs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/report/jd/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job descriptions:', error);
    throw error;
  }
};  

export const createJD = async (jdData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/report/jd/`, jdData);
    return response.data;
  } catch (error) {
    console.error('Error creating job description:', error);
    throw error;
  }
};

export const deleteJD = async (jobId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/report/jd/${jobId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job description:', error);
    throw error;
  }
};


export const updateJD = async (jobId, jdData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/report/jd/${jobId}/`, jdData);
    return response.data;
  } catch (error) {
    console.error('Error updating job description:', error);
    throw error;
  }
};

export const getReport = async (reportId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/report/reports/${reportId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};


export const createReport = async (reportData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/report/reports/`, reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const deleteReport = async (reportId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/report/reports/${reportId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};


export const fetchReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/report/reports/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};