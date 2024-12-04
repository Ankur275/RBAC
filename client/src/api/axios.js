import axios from "axios";

// Create an instance of axios
const apiClient = axios.create({
    baseURL: "http://localhost:4000/", // Update with your backend's base URL
    withCredentials: true, // Enables sending cookies with requests
});

// Add a request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add the access token to the Authorization header for protected routes
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiry (401 Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Request a new access token (assuming you have a refresh token endpoint)
                const { data } = await axios.post("http://localhost:4000/auth/refresh", {}, { withCredentials: true });

                // Save the new access token and retry the original request
                localStorage.setItem("accessToken", data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.removeItem("accessToken");
                window.location.href = "/login"; // Redirect to login if refresh fails
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
