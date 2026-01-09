import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import configs from "@/config/api";
import { useAuthStore } from "@/store/auth";

const apiClient: AxiosInstance = axios.create({
  baseURL: configs.apiUrl,
  timeout: configs.timeout,
  headers: configs.headers,
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from zustand store
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await useAuthStore.getState().refreshAccessToken();
        
        if (refreshResponse?.access_token) {
          // Process queued requests
          processQueue(null, refreshResponse.access_token);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.access_token}`;
          }
          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          // Refresh failed, clear auth and redirect to login
          processQueue(new Error("Token refresh failed"), null);
          useAuthStore.getState().clearAuth();
          
          // Redirect to login if we're in browser
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          
          isRefreshing = false;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
