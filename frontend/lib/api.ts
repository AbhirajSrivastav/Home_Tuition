import axios, { AxiosError, AxiosInstance } from 'axios';

// API client configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 - token expired
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );

          localStorage.setItem('accessToken', response.data.token);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH ENDPOINTS ============

export const authAPI = {
  signup: (data: {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'parent' | 'tutor';
  }) => apiClient.post('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),

  logout: () => apiClient.post('/auth/logout'),

  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
};

// ============ TUTOR ENDPOINTS ============

export const tutorAPI = {
  getAll: (params: {
    subject?: string;
    minRate?: number;
    maxRate?: number;
    location?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }) => apiClient.get('/tutors', { params }),

  getById: (id: string) => apiClient.get(`/tutors/${id}`),

  create: (data: any) => apiClient.post('/tutors', data),

  update: (id: string, data: any) => apiClient.put(`/tutors/${id}`, data),

  getAvailability: (id: string) =>
    apiClient.get(`/tutors/${id}/availability`),

  updateAvailability: (id: string, data: any) =>
    apiClient.put(`/tutors/${id}/availability`, data),

  search: (query: string) =>
    apiClient.get('/tutors', { params: { search: query } }),
};

// ============ BOOKING ENDPOINTS ============

export const bookingAPI = {
  create: (data: any) => apiClient.post('/bookings', data),

  getAll: (params: { status?: string; page?: number; limit?: number }) =>
    apiClient.get('/bookings', { params }),

  getById: (id: string) => apiClient.get(`/bookings/${id}`),

  approve: (id: string) => apiClient.put(`/bookings/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.put(`/bookings/${id}/reject`, { reason }),

  cancel: (id: string, reason: string) =>
    apiClient.put(`/bookings/${id}/cancel`, { reason }),

  complete: (id: string) => apiClient.put(`/bookings/${id}/complete`),
};

// ============ MESSAGE ENDPOINTS ============

export const messageAPI = {
  getConversations: () => apiClient.get('/conversations'),

  createConversation: (participantId: string) =>
    apiClient.post('/conversations', { participantId }),

  getMessages: (conversationId: string, params?: any) =>
    apiClient.get(`/messages/${conversationId}`, { params }),

  sendMessage: (data: {
    conversationId: string;
    text: string;
    bookingId?: string;
  }) => apiClient.post('/messages', data),
};

// ============ REVIEW ENDPOINTS ============

export const reviewAPI = {
  create: (data: any) => apiClient.post('/reviews', data),

  getByTutor: (tutorId: string, params?: any) =>
    apiClient.get(`/reviews/tutor/${tutorId}`, { params }),

  delete: (id: string) => apiClient.delete(`/reviews/${id}`),
};

// ============ USER ENDPOINTS ============

export const userAPI = {
  getProfile: () => apiClient.get('/users/me'),

  updateProfile: (data: any) => apiClient.put('/users/me', data),

  getById: (id: string) => apiClient.get(`/users/${id}`),
};

export default apiClient;
