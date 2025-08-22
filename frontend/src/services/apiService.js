// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.headers.Authorization;
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // PATCH request with FormData
  async patchWithFormData(endpoint, formData) {
    const headers = { ...this.headers };
    delete headers['Content-Type'];

    return this.request(endpoint, {
      method: 'PATCH',
      headers,
      body: formData,
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Cart APIs
  async getCart() {
    return this.get('/api/cart/');
  }

  async addToCart(itemData) {
    return this.post('/api/cart/add/', itemData);
  }

  async updateCartItem(itemId, itemData) {
    return this.put(`/api/cart/update/${itemId}/`, itemData);
  }

  async removeFromCart(itemId) {
    return this.delete(`/api/cart/remove/${itemId}/`);
  }

  async checkout() {
    return this.post('/api/cart/checkout/');
  }

  // Donation APIs
  async getDonationStatistics() {
    return this.get('/api/donations/statistics/');
  }

  async createDonation(donationData) {
    return this.post('/api/donations/', donationData);
  }

  async getDonations(page = 1) {
    return this.get(`/api/donations/?page=${page}`);
  }

  // Payments APIs
  async initiatePayment(paymentData) {
    return this.post('/api/payments/initiate/', paymentData);
  }

  async verifyPayment(reference) {
    return this.get(`/api/payments/verify/${reference}/`);
  }

  // Cause APIs
  async getCauses(page = 1) {
    return this.get(`/api/causes/?page=${page}`);
  }

  async getNewCauses(page = 1) {
    return this.get(`/api/causes/list/?page=${page}`);
  }

  async getCauseById(id) {
    return this.get(`/api/causes/details/${id}/`);
  }

  async createCause(causeData) {
    return this.post('/api/causes/', causeData);
  }

  // User APIs
  async getUserProfile() {
    return this.get('/api/user/profile/');
  }

  async updateUserProfile(profileData) {
    const formData = new FormData();
    for (const key in profileData) {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        // If the key is 'user', we need to handle it differently
        if (key === 'user' && typeof profileData[key] === 'object') {
            for (const userKey in profileData[key]) {
                if (profileData[key][userKey] !== null && profileData[key][userKey] !== undefined) {
                    formData.append(`user.${userKey}`, profileData[key][userKey]);
                }
            }
        } else {
            formData.append(key, profileData[key]);
        }
      }
    }
    return this.patchWithFormData('/api/user/profile/', formData);
  }

  async registerUser(userData) {
    return this.post('/api/auth/register/', userData);
  }

  async loginUser(credentials) {
    return this.post('/api/auth/login/', credentials);
  }

  async googleAuth(token) {
    return this.post('/api/auth/google/', { access_token: token });
  }

  // Organizer/Admin APIs
  async getPendingCauses() {
    return this.get('/api/causes/admin/causes/?status=under_review');
  }

  async updateCauseStatus(causeId, statusData) {
    return this.patch(`/api/causes/admin/causes/${causeId}/update/`, statusData);
  }

  // Success Stories / Blogs APIs (if implemented)
  async getSuccessStories() {
    return this.get('/api/success-stories/');
  }

  async getBlogPosts() {
    return this.get('/api/blog-posts/');
  }

  // Contributors / Users APIs
  async getContributors() {
    return this.get('/api/contributors/');
  }

  // Testimonials APIs
  async getTestimonials() {
    return this.get('/api/testimonials/');
  }

  // Statistics APIs
  async getStatistics() {
    return this.get('/api/statistics/');
  }

  // Newsletter subscription
  async subscribeToNewsletter(email) {
    return this.post('/api/newsletter/subscribe/', { email });
  }

  // Dashboard APIs
  async getDashboardMetrics() {
    return this.get('/api/admin/dashboard/metrics/');
  }

  async getAdminUsers() {
    return this.get('/api/admin/dashboard/users/');
  }

  async getAdminDonations() {
    return this.get('/api/admin/dashboard/donations/');
  }

  async getAdminCauses() {
    return this.get('/api/admin/dashboard/causes/');
  }

  async getAdminPayments() {
    return this.get('/api/admin/dashboard/payments/');
  }

  async getAdminWithdrawals() {
    return this.get('/api/admin/dashboard/withdrawals/');
  }

  // Notifications APIs
  async getNotifications() {
    return this.get('/api/admin/notifications/');
  }
}

const apiService = new ApiService();
export default apiService;
