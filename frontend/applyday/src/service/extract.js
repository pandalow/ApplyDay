import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Extract CRUD 接口
export const fetchExtracts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/extract/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching extracts:', error);
    throw error;
  }
};

export const createExtract = async (extractData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract/`, extractData);
    return response.data;
  } catch (error) {
    console.error("Error creating extract:", error);
    throw error;
  }
};

export const partialUpdateExtract = async (id, extractData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/extract/${id}/`, extractData);
    return response.data;
  } catch (error) {
    console.error("Error updating extract:", error);
    throw error;
  }
};

// 单独的 extract 功能 - 处理提取任务
export const processExtract = async (startDate, endDate) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract/process_extract/`, {
      start: startDate,
      end: endDate
    });
    return response.data;
  } catch (error) {
    console.error("Error processing extract:", error);
    throw error;
  }
};

export const deleteExtract = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/extract/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting extract:", error);
    throw error;
  }
};
