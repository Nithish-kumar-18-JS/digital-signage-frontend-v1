import axios from 'axios';

// Helper to get token (adjust as needed)
function getToken() {
  // Example: from localStorage or cookies
  return localStorage.getItem('x-auth-token');
}

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.API_URL, // your API base URL
  timeout: 10000,
});

// Request interceptor to add token header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses globally
apiClient.interceptors.response.use(
  (response) => {
    // You can handle token refresh, logging, etc here if needed
    return response;
  },
  (error) => {
    // Handle errors globally (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Optionally, redirect to login or refresh token
      console.error('Unauthorized, redirecting to login...');
      // window.location.href = '/login';  // example redirect
    }
    return Promise.reject(error);
  }
);

export default apiClient;
