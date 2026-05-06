const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_URL}/api/auth/register`,
  BOOKINGS_CREATE: `${API_URL}/api/bookings`,
  BOOKINGS_GET: `${API_URL}/api/bookings`,
  BOOKINGS_SUMMARY: `${API_URL}/api/bookings/summary`,
  BOOKINGS_UPDATE: (id) => `${API_URL}/api/bookings/${id}`,
  BOOKINGS_DELETE: (id) => `${API_URL}/api/bookings/${id}`,
};

export default API_URL;
