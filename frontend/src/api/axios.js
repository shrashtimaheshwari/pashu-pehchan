import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if error is 401 Unauthorized (Token Expiration)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;
