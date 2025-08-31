import axios from 'axios';


const API_BASE_URL = 'http://localhost:8000/'; // Adjust the base URL as needed

export const fetchApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export const createApplications = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications`);
    return response.data;
  } catch (error){
    console.error("Error creating applications", error);
    throw error;
  }
}


export const getStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/get_stats`);
    return response.data;
  } catch (error){
    console.error("Error creating applications", error);
      throw error;
  }
}