import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // 修正 API 地址

// Application CRUD 接口
export const fetchApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const createApplication = async (applicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications/`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

export const updateApplication = async (id, applicationData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/applications/${id}/`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

export const deleteApplication = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/applications/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

export const getApplication = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/get_stats/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};