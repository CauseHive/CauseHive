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
        const errorData = await response.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }
      // Handle cases where response might be empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // --- Specific API Methods ---

  // User APIs
  registerUser(userData) {
    return this.post('/api/auth/register/', userData);
  }

  loginUser(credentials) {
    return this.post('/api/auth/login/', credentials);
  }

  googleAuth(token) {
    return this.post('/api/auth/google/', { access_token: token });
  }

  // Cause APIs
  getCauses(page = 1) {
    return this.get(`/api/causes/?page=${page}`);
  }

  getCauseById(id) {
    return this.get(`/api/causes/${id}/`);
  }

  createCause(causeData) {
    // Assuming causeData is FormData
    return this.request('/api/causes/', {
      method: 'POST',
      body: causeData,
      headers: { ...this.headers, 'Content-Type': undefined }, // Let browser set content type for FormData
    });
  }


  // Donation APIs
  getDonationStatistics() {
    return this.get('/api/donations/statistics/');
  }

  createDonation(donationData) {
    return this.post('/api/donations/', donationData);
  }

  getDonations(page = 1) {
    return this.get(`/api/donations/?page=${page}`);
  }

  // Cart APIs
  getCart() {
    return this.get('/api/cart/');
  }

  addToCart(itemData) {
    return this.post('/api/cart/add/', itemData);
  }

  removeFromCart(itemId) {
    return this.post(`/api/cart/remove/${itemId}/`);
  }

  updateCartItem(itemId, quantity) {
    return this.put(`/api/cart/update/${itemId}/`, { quantity });
  }

  // Success Stories / Blogs APIs
  getSuccessStories() {
    return this.get('/api/success-stories/');
  }

  getBlogPosts() {
    return this.get('/api/blog-posts/');
  }

  // Contributors / Users APIs
  getContributors() {
    return this.get('/api/contributors/');
  }

  // Testimonials APIs
  getTestimonials() {
    return this.get('/api/testimonials/');
  }

  // Statistics APIs
  getStatistics() {
    return this.get('/api/statistics/');
  }

  // Newsletter subscription
  subscribeToNewsletter(email) {
    return this.post('/api/newsletter/subscribe/', { email });
  }
}

const apiService = new ApiService();
export default apiService;
