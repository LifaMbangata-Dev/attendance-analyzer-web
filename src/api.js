import axios from 'axios';

//const API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'https://attendance-analyzer-production-9958.up.railway.app/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate axios instance for file uploads (no JSON header)
const uploadApi = axios.create({
  baseURL: API_BASE_URL,
});

export const attendanceAPI = {
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use Fetch API for file uploads (cleaner multipart handling)
    const response = await fetch(`${API_BASE_URL}/attendance/upload`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header - browser sets it automatically with boundary
      // No headers object - let fetch handle it
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }
    return response.json();
  },

  getHealth: async () => {
    const response = await api.get('/attendance/health');
    return response.data;
  },
};

export const reportsAPI = {
  getCompanySummary: async () => {
    const response = await api.get('/reports/company');
    return response.data;
  },

  getEmployeeSummary: async (employeeId) => {
    const response = await api.get(`/reports/employee/${employeeId}`);
    return response.data;
  },

  getEmployeeIncidents: async (employeeId) => {
    try {
      const response = await api.get(`/reports/employee/${employeeId}/incidents`);
      return response.data;
    } catch (err) {
      // Endpoint may not exist yet, return empty array
      console.log('Incidents endpoint not available');
      return [];
    }
  },

  getCompanyIncidentReport: async () => {
    try {
      const response = await api.get('/reports/company/incidents');
      return response.data;
    } catch (err) {
      // Endpoint may not exist yet
      console.log('Company incident report endpoint not available');
      return null;
    }
  },

  getDepartmentSummaries: async () => {
    const response = await api.get('/reports/departments');
    return response.data;
  },
};

export default api;
