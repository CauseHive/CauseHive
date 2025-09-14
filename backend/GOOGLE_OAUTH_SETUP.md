# Google OAuth Setup Guide for CauseHive

## 🚀 Backend Setup (Completed)

### 1. Environment Variables
Add these to your `.env` file:
```env
GOOGLE_OAUTH2_CLIENT_ID=your_google_client_id_here
GOOGLE_OAUTH2_SECRET=your_google_client_secret_here
```

### 2. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://127.0.0.1:9000/api/user/google/callback/` (development)
   - `https://yourdomain.com/api/user/google/callback/` (production)
7. Copy Client ID and Client Secret to your `.env` file

### 3. Django Setup
The Google OAuth integration is already configured in your Django settings. No additional setup commands needed!

## 🌐 Frontend Integration

### How It Works
1. **Frontend** calls `/api/user/google/url/` to get Google OAuth URL
2. **User** clicks the URL and authorizes on Google
3. **Google** redirects to `/api/user/google/callback/` with authorization code
4. **Backend** exchanges code for tokens, creates/authenticates user, generates JWT
5. **Backend** redirects to `/api/user/profile/?access_token=JWT_TOKEN`
6. **Frontend** extracts access token from URL and stores it for API calls

### React/Next.js Implementation

#### 1. Google OAuth Button Component
```jsx
// components/GoogleOAuthButton.jsx
import React, { useState } from 'react';

const GoogleOAuthButton = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Get Google OAuth URL from backend
      const response = await fetch('http://127.0.0.1:9000/api/user/google/url/');
      const data = await response.json();
      
      if (data.google_oauth_url) {
        // Redirect to Google OAuth
        window.location.href = data.google_oauth_url;
      } else {
        throw new Error('Failed to get OAuth URL');
      }
    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      disabled={loading}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {loading ? 'Connecting...' : 'Continue with Google'}
    </button>
  );
};

export default GoogleOAuthButton;
```

#### 2. OAuth Callback Handler
```jsx
// hooks/useGoogleOAuth.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGoogleOAuth = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're returning from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    
    if (token) {
      // Extract user data from the profile response
      // The backend redirects to /api/user/profile/?access_token=... with user data
      handleOAuthCallback(token);
    } else {
      setLoading(false);
    }
  }, []);

  const handleOAuthCallback = async (token) => {
    try {
      // The backend already redirected to profile with token
      // We need to extract the data from the current page
      const response = await fetch(`http://127.0.0.1:9000/api/user/profile/?access_token=${token}`);
      const data = await response.json();
      
      if (data.user && data.access_token) {
        setUser(data.user);
        setAccessToken(data.access_token);
        
        // Store token in localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard or home
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    navigate('/login');
  };

  return { user, accessToken, loading, logout };
};
```

#### 3. API Service with JWT
```jsx
// services/api.js
class ApiService {
  constructor() {
    this.baseURL = 'http://127.0.0.1:9000/api';
    this.accessToken = localStorage.getItem('access_token');
  }

  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired, redirect to login
        this.logout();
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User profile methods
  async getUserProfile() {
    return this.request('/user/profile/');
  }

  async updateUserProfile(data) {
    return this.request('/user/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Causes methods
  async getCauses() {
    return this.request('/causes/');
  }

  async createCause(data) {
    return this.request('/causes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.accessToken = null;
  }
}

export default new ApiService();
```

#### 4. Main App Component
```jsx
// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGoogleOAuth } from './hooks/useGoogleOAuth';
import GoogleOAuthButton from './components/GoogleOAuthButton';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, accessToken, loading } = useGoogleOAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to CauseHive
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in with your Google account to continue
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <GoogleOAuthButton 
              onSuccess={(user) => console.log('Login successful:', user)}
              onError={(error) => console.error('Login failed:', error)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Vue.js Implementation

#### 1. Google OAuth Button Component
```vue
<!-- components/GoogleOAuthButton.vue -->
<template>
  <button 
    @click="handleGoogleLogin"
    :disabled="loading"
    class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
  >
    <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
      <!-- Google icon SVG -->
    </svg>
    {{ loading ? 'Connecting...' : 'Continue with Google' }}
  </button>
</template>

<script>
export default {
  name: 'GoogleOAuthButton',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async handleGoogleLogin() {
      this.loading = true;
      try {
        const response = await fetch('http://127.0.0.1:9000/api/user/google/url/');
        const data = await response.json();
        
        if (data.google_oauth_url) {
          window.location.href = data.google_oauth_url;
        } else {
          throw new Error('Failed to get OAuth URL');
        }
      } catch (error) {
        console.error('Error initiating Google OAuth:', error);
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
```

#### 2. OAuth Composable
```js
// composables/useGoogleOAuth.js
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export function useGoogleOAuth() {
  const user = ref(null);
  const accessToken = ref(null);
  const loading = ref(true);
  const router = useRouter();

  const handleOAuthCallback = async (token) => {
    try {
      const response = await fetch(`http://127.0.0.1:9000/api/user/profile/?access_token=${token}`);
      const data = await response.json();
      
      if (data.user && data.access_token) {
        user.value = data.user;
        accessToken.value = data.access_token;
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    user.value = null;
    accessToken.value = null;
    router.push('/login');
  };

  onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    
    if (token) {
      handleOAuthCallback(token);
    } else {
      loading.value = false;
    }
  });

  return { user, accessToken, loading, logout };
}
```

### Vanilla JavaScript Implementation

#### 1. HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CauseHive - Google OAuth</title>
    <style>
        .google-btn {
            background: #db4437;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .google-btn:hover {
            background: #c23321;
        }
        .google-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .loading {
            width: 20px;
            height: 20px;
            border: 2px solid white;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div id="app">
        <div id="login-container">
            <h1>Welcome to CauseHive</h1>
            <p>Sign in with your Google account to continue</p>
            <button id="google-login-btn" class="google-btn">
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <!-- Google icon SVG -->
                </svg>
                Continue with Google
            </button>
        </div>
        <div id="dashboard" style="display: none;">
            <h1>Dashboard</h1>
            <p>Welcome, <span id="user-name"></span>!</p>
            <button id="logout-btn">Logout</button>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

#### 2. JavaScript Implementation
```javascript
// app.js
class GoogleOAuthApp {
    constructor() {
        this.baseURL = 'http://127.0.0.1:9000/api';
        this.accessToken = localStorage.getItem('access_token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        document.getElementById('google-login-btn').addEventListener('click', () => {
            this.handleGoogleLogin();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
    }

    async checkAuthStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        
        if (token) {
            await this.handleOAuthCallback(token);
        } else if (this.user && this.accessToken) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    async handleGoogleLogin() {
        const btn = document.getElementById('google-login-btn');
        btn.disabled = true;
        btn.innerHTML = '<div class="loading"></div>Connecting...';

        try {
            const response = await fetch(`${this.baseURL}/user/google/url/`);
            const data = await response.json();
            
            if (data.google_oauth_url) {
                window.location.href = data.google_oauth_url;
            } else {
                throw new Error('Failed to get OAuth URL');
            }
        } catch (error) {
            console.error('Error initiating Google OAuth:', error);
            btn.disabled = false;
            btn.innerHTML = 'Continue with Google';
        }
    }

    async handleOAuthCallback(token) {
        try {
            const response = await fetch(`${this.baseURL}/user/profile/?access_token=${token}`);
            const data = await response.json();
            
            if (data.user && data.access_token) {
                this.user = data.user;
                this.accessToken = data.access_token;
                
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                this.showDashboard();
            }
        } catch (error) {
            console.error('OAuth callback error:', error);
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('user-name').textContent = this.user.first_name + ' ' + this.user.last_name;
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        this.accessToken = null;
        this.user = null;
        this.showLogin();
    }

    // API methods
    async apiRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                this.logout();
                return;
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
}

// Initialize the app
new GoogleOAuthApp();
```

## 🔗 API Endpoints

### 1. Get Google OAuth URL
```
GET /api/user/google/url/
```
**Response:**
```json
{
  "google_oauth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&prompt=consent",
  "message": "Use this URL to initiate Google OAuth flow"
}
```

### 2. Google OAuth Callback
```
GET /api/user/google/callback/?code=AUTHORIZATION_CODE
```
**Description:** Handles Google's OAuth callback, exchanges code for tokens, creates/authenticates user, generates JWT, and redirects to profile with access token.

### 3. User Profile (with OAuth token)
```
GET /api/user/profile/?access_token=JWT_TOKEN
```
**Response:**
```json
{
  "profile": {
    "id": "profile_uuid",
    "full_name": "John Doe",
    "bio": null,
    "profile_picture": "http://127.0.0.1:9000/media/profile_pictures/default.jpg",
    "phone_number": null,
    "address": null,
    "withdrawal_address": null,
    "withdrawal_wallet": null,
    "updated_at": "2025-09-14T08:45:31.285353Z",
    "user": "user_uuid"
  },
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  },
  "message": "Google OAuth login successful!",
  "access_token": "jwt_access_token"
}
```

## 🧪 Testing

### 1. Test Google OAuth URL
```bash
curl http://127.0.0.1:9000/api/user/google/url/
```

### 2. Test Complete OAuth Flow
1. Start your Django server: `uv run python manage.py runserver 127.0.0.1:9000`
2. Open your frontend application
3. Click the Google OAuth button
4. Complete the Google OAuth flow
5. Verify you're redirected to profile with user data and access token

### 3. Test with cURL
```bash
# Get OAuth URL
curl http://127.0.0.1:9000/api/user/google/url/ | jq .

# Test profile with access token (replace with actual token)
curl "http://127.0.0.1:9000/api/user/profile/?access_token=YOUR_JWT_TOKEN" | jq .
```

## 🔧 Troubleshooting

### Common Issues:

1. **Invalid redirect URI**: Make sure the redirect URI in Google Console matches your backend URL
2. **Client ID not found**: Verify your `.env` file has the correct Google OAuth credentials
3. **CORS errors**: Ensure your frontend domain is in `CORS_ALLOWED_ORIGINS`
4. **HTTPS required**: Google OAuth requires HTTPS in production
5. **Scope mismatch**: The implementation uses Google's full OAuth scope URLs

### Debug Commands:
```bash
# Check environment variables
uv run python -c "from django.conf import settings; print('Client ID:', settings.GOOGLE_OAUTH2_CLIENT_ID)"

# Test OAuth URL generation
curl http://127.0.0.1:9000/api/user/google/url/ | jq .

# Check server logs
uv run python manage.py runserver 127.0.0.1:9000 --verbosity=2
```

## 🚀 Production Deployment

1. **Update Google Console** with production redirect URIs:
   - `https://yourdomain.com/api/user/google/callback/`

2. **Set environment variables** in production:
   ```env
   GOOGLE_OAUTH2_CLIENT_ID=your_production_client_id
   GOOGLE_OAUTH2_SECRET=your_production_client_secret
   ```

3. **Update frontend URLs** to use production backend:
   ```javascript
   const baseURL = 'https://yourdomain.com/api';
   ```

4. **Ensure HTTPS** is enabled for both frontend and backend

5. **Update CORS settings** for production domain:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://yourdomain.com",
       "https://www.yourdomain.com",
   ]
   ```

## 📝 Key Features

- ✅ **Automatic user creation** - Users are created automatically on first OAuth login
- ✅ **JWT token generation** - Access tokens for API authentication
- ✅ **Profile management** - User profiles are accessible after OAuth login
- ✅ **Secure redirect flow** - Direct redirect to profile with access token
- ✅ **Error handling** - Comprehensive error handling for OAuth failures
- ✅ **Production ready** - HTTPS support and proper security measures

## 🔐 Security Notes

- Access tokens are included in URL parameters for the redirect flow
- Tokens should be stored securely in localStorage or secure cookies
- Implement proper token refresh logic for long-term sessions
- Consider implementing CSRF protection for state parameters
- Always use HTTPS in production environments