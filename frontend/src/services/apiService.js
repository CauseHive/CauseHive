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

  // Cause APIs
  async getCauses(page = 1) {
    return this.get(`/api/causes/?page=${page}`);
  }

  async getCauseById(id) {
    return this.get(`/api/causes/${id}/`);
  }

  async createCause(causeData) {
    return this.post('/api/causes/', causeData);
  }

  // User APIs
  async registerUser(userData) {
    return this.post('/api/auth/register/', userData);
  }

  async loginUser(credentials) {
    return this.post('/api/auth/login/', credentials);
  }

  async googleAuth(token) {
    return this.post('/api/auth/google/', { access_token: token });
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
}

const apiService = new ApiService();
export default apiService;
