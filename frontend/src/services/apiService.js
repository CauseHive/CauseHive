// API Configuration (Vite + fallback)
let API_BASE_URL = process.env.REACT_APP_API_URL ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (window && window.location && window.location.hostname.includes('causehive.tech')
    ? ''  // Use relative URLs when on causehive.tech domain
    : 'http://www.causehive.tech');// Normalize base URL: remove trailing slashes and strip a trailing '/api' segment
if (typeof API_BASE_URL === 'string') {
  API_BASE_URL = API_BASE_URL.replace(/\/+$|\s+$/g, '');
  // Treat a single-root slash as relative base
  if (API_BASE_URL === '/') API_BASE_URL = '';
  if (API_BASE_URL.toLowerCase().endsWith('/api')) {
    API_BASE_URL = API_BASE_URL.slice(0, -4);
  }
}

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
      if (token) this.setAuthToken(token);
    } catch (_) {}
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      this.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.headers.Authorization;
    }
  }

  setTokens(access, refresh) {
    if (typeof window !== 'undefined') {
      try {
        if (access) window.localStorage.setItem('accessToken', access);
        if (refresh) window.localStorage.setItem('refreshToken', refresh);
        if (access) {
          const payload = this.parseJwt(access);
          const uid = payload && (payload.user_id || payload.user || payload.sub);
          if (uid) {
            window.localStorage.setItem('user_id', String(uid));
          }
        }
      } catch (_) {}
    }
    if (access) this.setAuthToken(access);
  }

  // Low-level request helpers
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.headers,
      ...options,
    };
    try {
      const resp = await fetch(url, config);
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`API ${resp.status} ${resp.statusText}: ${text}`);
      }
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return resp.json();
      }
      return resp.text();
    } catch (error) {
      // Centralized error handling
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  getStoredUserId() {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem('user_id') : null;
    } catch (_) {
      return null;
    }
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Decode a JWT access token (browser-safe)
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        (typeof atob !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary'))
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (_) {
      return null;
    }
  }

  async postForm(endpoint, formData) {
    // Do not set Content-Type so the browser adds proper multipart boundary
    const { Authorization } = this.headers;
    return this.request(endpoint, {
      method: 'POST',
      headers: Authorization ? { Authorization } : {},
      body: formData,
    });
  }

  async putForm(endpoint, formData) {
    const { Authorization } = this.headers;
    return this.request(endpoint, {
      method: 'PUT',
      headers: Authorization ? { Authorization } : {},
      body: formData,
    });
  }

  // Auth APIs (monolith)
  async registerUser({ first_name, last_name, email, password, password2 }) {
    return this.post('/api/user/auth/signup/', { first_name, last_name, email, password, password2 });
  }

  async loginUser({ email, password }) {
    const data = await this.post('/api/user/auth/login/', { email, password });
    if (data && (data.access || data.refresh)) {
      this.setTokens(data.access, data.refresh);
    }
    return data;
  }

  async refreshToken() {
    try {
      const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : null;
      if (!refresh) return null;
      const data = await this.post('/api/user/token/refresh/', { refresh });
      if (data && data.access) {
        this.setTokens(data.access, refresh);
        return data.access;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // User profile
  async getProfile() {
    return this.get('/api/user/profile/');
  }

  async updateProfile({ bio, phone_number, address, withdrawal_address, profile_picture, cover_photo }) {
    const form = new FormData();
    if (bio != null) form.append('bio', bio);
    if (phone_number != null) form.append('phone_number', phone_number);
    if (address != null) form.append('address', address);
    if (withdrawal_address != null) form.append('withdrawal_address', typeof withdrawal_address === 'string' ? withdrawal_address : JSON.stringify(withdrawal_address));
    if (profile_picture) form.append('profile_picture', profile_picture);
    if (cover_photo) form.append('cover_photo', cover_photo);
    return this.putForm('/api/user/profile/', form);
  }

  async getBanks() { return this.get('/api/user/banks/'); }
  async getMobileMoney() { return this.get('/api/user/mobile-money/'); }
  async validateBankAccount({ bank_code, account_number }) { return this.post('/api/user/validate-bank-account/', { bank_code, account_number }); }

  // Causes
  async getCauses(page = 1) { return this.get(`/api/causes/list/?page=${page}`); }
  async getCausesList(page = 1) { return this.get(`/api/causes/list/?page=${page}`); }
  async getCauseDetails(id) { return this.get(`/api/causes/details/${id}/`); }
  async getUserCauses(page = 1) { 
    const userId = this.getStoredUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.get(`/api/causes/admin/causes/?organizer_id=${userId}&page=${page}`); 
  }
  async updateCause(id, data) { return this.put(`/api/causes/admin/causes/${id}/update/`, data); }
  async deleteCause(id) { return this.delete(`/api/causes/delete/${id}/`); }

  // Search functionality
  async searchSuggestions(query) {
    try {
      // Search across causes, organizers, and categories
      const response = await this.get(`/api/causes/search/?q=${encodeURIComponent(query)}&limit=8`);
      
      // Format suggestions for the SearchBar component
      const suggestions = [];
      
      if (response.results) {
        // Add cause suggestions
        response.results.forEach(cause => {
          suggestions.push({
            type: 'cause',
            title: cause.name || cause.title,
            description: cause.description ? cause.description.slice(0, 60) + '...' : '',
            id: cause.id,
            url: `/causes/${cause.id}`
          });
        });
      }
      
      return suggestions;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      // Return fallback suggestions based on common searches
      return this.getFallbackSuggestions(query);
    }
  }

  // Fallback suggestions when API is unavailable
  getFallbackSuggestions(query) {
    const commonSearches = [
      'education', 'healthcare', 'environment', 'poverty relief', 'disaster relief',
      'community development', 'youth development', 'women empowerment', 'agriculture',
      'water and sanitation', 'technology', 'arts and culture'
    ];
    
    return commonSearches
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(term => ({
        type: 'category',
        title: term.charAt(0).toUpperCase() + term.slice(1),
        description: `Search for ${term} related causes`,
        text: term
      }));
  }
  async createCause({ name, description, target_amount, organizer_id, category, category_data, cover_image }) {
    const form = new FormData();
    form.append('name', name);
    if (description != null) form.append('description', description);
    if (target_amount != null) form.append('target_amount', target_amount);
    if (organizer_id) form.append('organizer_id', organizer_id);
    if (category) form.append('category', category);
    if (category_data) form.append('category_data', JSON.stringify(category_data));
    if (cover_image) form.append('cover_image', cover_image);
    return this.postForm('/api/causes/create/', form);
  }

  // Categories
  async getCategories() { return this.get('/api/categories/list/'); }

  // Donations and payments (subset wired)
  async initiatePayment({ email, amount, user_id, donation_id }) { return this.post('/api/payments/initiate/', { email, amount, user_id, donation_id }); }
  async verifyPayment(reference) { return this.get(`/api/payments/verify/${reference}/`); }

  // Direct donation (currently used method)
  async donate({ email, cause_id, donation_amount, quantity = 1 }) {
    return this.post('/api/donations/create/', { email, cause_id, donation_amount, quantity });
  }

  // Landing/demo placeholder APIs (safe fallbacks)
  async getDonationStatistics() { 
    try {
      return await this.get('/api/donations/statistics/');
    } catch (error) {
      console.warn('Donation statistics endpoint error, using fallback data');
      return {
        total_amount: 0,
        total_donations: 0,
        recent_donations: []
      };
    }
  }

  async createDonation(donationData) { 
    return this.post('/api/donations/', donationData); 
  }

  async getDonations(page = 1) { 
    try {
      return await this.get(`/api/donations/?page=${page}`);
    } catch (error) {
      console.warn('Donations endpoint error, using fallback data', error);
      return {
        results: [],
        count: 0,
        next: null,
        previous: null
      };
    }
  }

  // Optional CMS-style placeholders with fallbacks
  async getSuccessStories() { 
    try {
      return await this.get('/api/success-stories/');
    } catch (error) {
      console.warn('Success stories endpoint not available, using fallback data');
      return { results: [], count: 0 };
    }
  }

  async getBlogPosts() { 
    try {
      return await this.get('/api/blog-posts/');
    } catch (error) {
      console.warn('Blog posts endpoint not available, using fallback data');
      return { 
        results: [
          {
            id: 1,
            title: "Making a Difference Together",
            excerpt: "Discover how your contributions are creating positive change in communities worldwide.",
            date: new Date().toISOString(),
            slug: "making-difference-together"
          }
        ], 
        count: 1 
      };
    }
  }



  // Admin APIs
  async getAdminCauses(page = 1, status = '') {
    const params = new URLSearchParams({ page });
    if (status) params.append('status', status);
    return this.get(`/api/causes/admin/causes/?${params}`);
  }
  async approveRejectCause(id, status, rejection_reason = '') {
    return this.put(`/api/causes/admin/causes/${id}/update/`, { status, rejection_reason });
  }
  async getAdminUsers(page = 1) { return this.get(`/api/users/admin-see/users/?page=${page}`); }
  async getAdminWithdrawals(page = 1) { return this.get(`/api/withdrawal/admin/requests/?page=${page}`); }
  async getAdminStatistics() { return this.get('/api/withdrawal/admin/statistics/'); }
  async retryWithdrawal(requestId) { return this.post(`/api/withdrawal/admin/requests/${requestId}/retry/`); }

  // Testimonials
  async getTestimonials(causeId, params = {}) {
    const queryParams = new URLSearchParams({
      ...params,
      ...(params.page && { page: params.page }),
      ...(params.sort && { sort: params.sort })
    }).toString();
    return this.get(`/api/testimonials/cause/${causeId}/${queryParams ? `?${queryParams}` : ''}`);
  }

  async createTestimonial(testimonialData) {
    return this.post('/api/testimonials/create/', testimonialData);
  }

  async updateTestimonial(testimonialId, testimonialData) {
    return this.put(`/api/testimonials/${testimonialId}/update/`, testimonialData);
  }

  async deleteTestimonial(testimonialId) {
    return this.delete(`/api/testimonials/${testimonialId}/delete/`);
  }

  async likeTestimonial(testimonialId) {
    return this.post(`/api/testimonials/${testimonialId}/like/`);
  }

  async getUserTestimonials(page = 1) {
    const userId = this.getStoredUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.get(`/api/testimonials/user/${userId}/?page=${page}`);
  }

  async getTestimonialStats(causeId) {
    return this.get(`/api/testimonials/cause/${causeId}/stats/`);
  }
}

const apiService = new ApiService();
export default apiService;
