import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5008/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint (which uses cookie)
                // Note: We need a separate instance or carefully avoid infinite loops
                // But since refresh endpoint doesn't require Bearer token (it uses cookie), it's safe.

                // IMPORTANT: We cannot use 'api' instance here if it keeps failing.
                // But axios instance handles this fine usually.

                // We must use axios directly or a separate instance to avoid circular dependency if we were importing api elsewhere
                // But here we are inside api.js.

                // Let's assume we can use axios directly for refresh to be safe from interceptors
                const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
                    withCredentials: true // Send cookies
                });

                if (response.status === 200) {
                    const { accessToken } = response.data;
                    localStorage.setItem('token', accessToken);

                    // Update header
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Logout if refresh fails
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
