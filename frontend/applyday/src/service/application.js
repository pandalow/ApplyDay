import axios from 'axios';
import API_CONFIG from '../config/api';

const API_BASE_URL = API_CONFIG.APPLICATION_API;

// Application CRUD 接口
export const fetchApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}info/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const createApplication = async (applicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}info/`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

export const updateApplication = async (id, applicationData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}info/${id}/`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

export const deleteApplication = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}info/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

export const getApplication = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}info/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}info/get_stats/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
// Job Description CRUD 接口
export const fetchJDs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}jd/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job descriptions:', error);
    throw error;
  }
};  

export const createJD = async (jdData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}jd/`, jdData);
    return response.data;
  } catch (error) {
    console.error('Error creating job description:', error);
    throw error;
  }
};

export const deleteJD = async (jobId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}jd/${jobId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job description:', error);
    throw error;
  }
};

export const updateJD = async (jobId, jdData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}jd/${jobId}/`, jdData);
    return response.data;
  } catch (error) {
    console.error('Error updating job description:', error);
    throw error;
  }
};


// Extract CRUD 接口
export const fetchExtracts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}extract/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching extracts:', error);
    throw error;
  }
};

export const createExtract = async (extractData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}extract/`, extractData);
    return response.data;
  } catch (error) {
    console.error("Error creating extract:", error);
    throw error;
  }
};

export const partialUpdateExtract = async (id, extractData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}extract/${id}/`, extractData);
    return response.data;
  } catch (error) {
    console.error("Error updating extract:", error);
    throw error;
  }
};


export const deleteExtract = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}extract/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting extract:", error);
    throw error;
  }
};

export const fetchResumes = async () => {
  try {
    const url = `${API_BASE_URL}resumes/`;
    console.log('Fetching resumes from:', url);
    const response = await axios.get(url);
    console.log('Resumes response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    console.error("Request details:", {
      url: `${API_BASE_URL}resumes/`,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

export const createResume = async (resumeData) => {
  try {
    const url = `${API_BASE_URL}resumes/`;
    console.log('Creating resume at:', url);
    console.log('Resume data:', resumeData);
    const response = await axios.post(url, resumeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Create resume response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating resume:", error);
    console.error("Request details:", {
      url: `${API_BASE_URL}resumes/`,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
};

export const deleteResume = async (resumeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}resumes/${resumeId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};

export const getResume = async (resumeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}resumes/${resumeId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resume:", error);
    throw error;
  }
};

// Generate pipeline/report function
export const generatePipeline = async (data) => {
  try {
    const response = await axios.post(`${API_CONFIG.REPORT_API}run/`, data);
    return response.data;
  } catch (error) {
    console.error('Error generating pipeline:', error);
    throw error;
  }
};


// Resume Text CRUD api
export const fetchResumeTexts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}resumes/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resume texts:", error);
    throw error;
  }
}

export const createResumeText = async (fileData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}resumes/`, fileData);
    return response.data;
  } catch (error) {
    console.error("Error creating resume text:", error);
    throw error;
  }
}
export const deleteResumeText = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}resumes/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resume text:", error);
    throw error;
  }
};

export const updateResumeText = async (id, fileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}resumes/${id}/`, fileData);
    return response.data;
  } catch (error) {
    console.error("Error updating resume text:", error);
    throw error;
  }
};
