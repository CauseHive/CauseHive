// API Configuration (Vite + fallback)
let API_BASE_URL = process.env.REACT_APP_API_URL ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (window && window.location && window.location.hostname.includes('causehive.tech')
    ? ''  // Use relative URLs when on causehive.tech domain
    : 'http://www.causehive.tech');// Normalize base URL: remove trailing slashes and strip a trailing '/api' segment
if (typeof API_BASE_URL === 'string') {
  API_BASE_URL = API_BASE_URL.replace(/\/+$|\s+$/g, '');
  // Treat a single-root slash as relative base
  if (API_BASE_URL === '/') {
    API_BASE_URL = '';
  }
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
      if (token) {
      this.setAuthToken(token);
    }
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
        if (access) {
          window.localStorage.setItem('accessToken', access);
        }
        if (refresh) {
          window.localStorage.setItem('refreshToken', refresh);
        }
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
    const { requiresAuth = true, ...otherOptions } = options;
    
    // Create headers object, conditionally including Authorization
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...otherOptions.headers,
    };
    
    if (requiresAuth) {
      try {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
        if (token) {
          requestHeaders.Authorization = `Bearer ${token}`;
        }
      } catch (_) {}
    }
    
    const config = {
      headers: requestHeaders,
      ...otherOptions,
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

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  getStoredUserId() {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem('user_id') : null;
    } catch (_) {
      return null;
    }
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
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

  async postForm(endpoint, formData, options = {}) {
    // Do not set Content-Type so the browser adds proper multipart boundary
    const { requiresAuth = true } = options;
    const headers = {};
    if (requiresAuth) {
      try {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (_) {}
    }
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
      ...options,
    });
  }

  async putForm(endpoint, formData, options = {}) {
    const { requiresAuth = true } = options;
    const headers = {};
    if (requiresAuth) {
      try {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null;
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (_) {}
    }
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: formData,
      ...options,
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
  async getCauses(page = 1) { return this.get(`/api/causes/list/?page=${page}`, { requiresAuth: false }); }
  async getCausesList(page = 1) { return this.get(`/api/causes/list/?page=${page}`, { requiresAuth: false }); }
  async getCauseDetails(id) { return this.get(`/api/causes/details/${id}/`, { requiresAuth: false }); }
  async getUserCauses(page = 1) { 
    try {
      // Try the my-causes endpoint first
      return await this.get(`/api/causes/my-causes/?page=${page}`);
    } catch (error) {
      // If my-causes endpoint doesn't exist, use general causes list and filter client-side
      // This is a fallback until backend implements user-specific endpoints
      console.warn('My-causes endpoint not available, using general causes list...');
      
      try {
        const userId = this.getStoredUserId();
        if (!userId) {
          return { results: [], count: 0 };
        }
        
        // Get all causes and filter by organizer_id on client side
        const allCauses = await this.get(`/api/causes/list/?page=${page}`, { requiresAuth: false });
        
        // Filter causes where the current user is the organizer
        const userCauses = (allCauses.results || []).filter(cause => 
          cause.organizer_id === userId || cause.organizer === userId
        );
        
        return {
          ...allCauses,
          results: userCauses,
          count: userCauses.length
        };
      } catch (fallbackError) {
        console.error('Failed to get user causes:', fallbackError);
        return { results: [], count: 0 };
      }
    }
  }
  async updateCause(id, data) { 
    try {
      return await this.put(`/api/causes/my-causes/${id}/update/`, data);
    } catch (error) {
      // Try alternative endpoint pattern
      console.warn('My-causes update endpoint not available, trying alternatives...');
      try {
        return await this.put(`/api/causes/${id}/update/`, data);
      } catch (altError) {
        console.error('No working update endpoint found:', error, altError);
        throw new Error('Cause update functionality not available');
      }
    }
  }
  
  async deleteCause(id) { 
    try {
      return await this.delete(`/api/causes/delete/${id}/`);
    } catch (error) {
      console.error('Delete cause endpoint error:', error);
      throw error;
    }
  }

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
      throw error; // Re-throw to let caller handle the error
    }
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

  // Categories - Handle potential endpoint variations
  async getCategories() { 
    try {
      // Try the most likely endpoint first
      return await this.get('/api/categories/', { requiresAuth: false });
    } catch (error) {
      // Try alternative endpoint patterns
      try {
        return await this.get('/api/causes/categories/', { requiresAuth: false });
      } catch (altError) {
        console.error('Categories endpoint not found:', error, altError);
        // Return safe fallback
        return { 
          results: [
            { id: 1, name: 'Education', description: 'Educational causes' },
            { id: 2, name: 'Health', description: 'Health and medical causes' },
            { id: 3, name: 'Environment', description: 'Environmental causes' },
            { id: 4, name: 'Community', description: 'Community development' },
          ],
          count: 4 
        };
      }
    }
  }

  // Donations and payments (subset wired)
  async initiatePayment({ email, amount, user_id, donation_id }) { return this.post('/api/payments/initiate/', { email, amount, user_id, donation_id }); }
  async verifyPayment(reference) { return this.get(`/api/payments/verify/${reference}/`); }

  // Direct donation (currently used method)
  async donate({ email, cause_id, donation_amount, quantity = 1 }) {
    return this.post('/api/donations/create/', { email, cause_id, donation_amount, quantity });
  }

  // Landing/demo placeholder APIs (safe fallbacks)
  async getDonationStatistics() { 
    return this.get('/api/donations/statistics/');
  }

  async createDonation(donationData) { 
    return this.post('/api/donations/', donationData); 
  }

  async getDonations(page = 1) { 
    return this.get(`/api/donations/?page=${page}`);
  }

  // Optional CMS-style placeholders with fallbacks
  async getSuccessStories() { 
    return this.get('/api/success-stories/');
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
    };
  };



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

  // User Dashboard - Aggregate from existing endpoints since /api/user/dashboard/ might not exist
  async getUserDashboard() { 
    try {
      // Try the direct endpoint first
      return await this.get('/api/user/dashboard/');
    } catch (error) {
      // If endpoint doesn't exist, aggregate data from available endpoints
      console.warn('Direct dashboard endpoint not available, aggregating data...');
      
      try {
        // Get donation statistics
        const donations = await this.getDonations(1).catch(() => ({ results: [], count: 0 }));
        
        // Get user causes
        const causes = await this.getUserCauses(1).catch(() => ({ results: [], count: 0 }));
        
        // Calculate aggregated statistics
        const totalDonated = donations.results?.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0) || 0;
        const causesSupported = donations.results?.length || 0;
        const causesCreated = causes.results?.length || 0;
        const impactScore = Math.min((causesSupported * 10) + (causesCreated * 15), 100);
        
        // Format recent donations
        const recentDonations = (donations.results || []).slice(0, 5).map(donation => ({
          id: donation.id,
          cause: donation.cause_name || 'Unknown Cause',
          amount: parseFloat(donation.amount || 0),
          date: donation.created_at || donation.donated_at || new Date().toISOString(),
          status: donation.status || 'completed'
        }));
        
        return {
          totalDonated,
          causesSupported,
          causesCreated,
          impactScore,
          recentDonations
        };
      } catch (fallbackError) {
        console.error('Failed to aggregate dashboard data:', fallbackError);
        // Return safe fallback data
        return {
          totalDonated: 0,
          causesSupported: 0,
          causesCreated: 0,
          impactScore: 0,
          recentDonations: []
        };
      }
    }
  }

  // Testimonials - Add error handling and fallbacks
  async getTestimonials(causeId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        ...params,
        ...(params.page && { page: params.page }),
        ...(params.sort && { sort: params.sort })
      }).toString();
      return await this.get(`/api/testimonials/cause/${causeId}/${queryParams ? `?${queryParams}` : ''}`, { requiresAuth: false });
    } catch (error) {
      console.warn('Testimonials endpoint error:', error);
      return { results: [], count: 0 };
    }
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
    try {
      const userId = this.getStoredUserId();
      if (!userId) throw new Error('User not authenticated');
      return await this.get(`/api/testimonials/user/${userId}/?page=${page}`);
    } catch (error) {
      console.warn('User testimonials endpoint error:', error);
      return { results: [], count: 0 };
    }
  }

  async getTestimonialStats(causeId) {
    try {
      return await this.get(`/api/testimonials/cause/${causeId}/stats/`);
    } catch (error) {
      console.warn('Testimonial stats endpoint error:', error);
      return { total: 0, average_rating: 0 };
    }
  }
}

export default ApiService;
