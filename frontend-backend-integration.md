# Frontend-Backend Integration Guide

## 🔗 Connecting Frontend to Backend

### 1. Update Frontend Environment

Create/update your frontend `.env` file:

```bash
# Frontend .env
VITE_API_BASE_URL=http://your-ec2-ip:3001/api
# or for production with domain:
VITE_API_BASE_URL=https://api.your-domain.com/api
```

### 2. Update Auth Store

Replace the mock authentication in your frontend:

```javascript
// src/stores/authStore.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... existing state

      signIn: async (email: string, password: string) => {
        const { lockoutUntil } = get();

        if (lockoutUntil && Date.now() < lockoutUntil) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        set({ isLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          // Store token in localStorage
          localStorage.setItem('token', data.token);

          set({
            user: data.user,
            role: data.user.role,
            isLoading: false,
          });
          get().resetLoginAttempts();
        } catch (error) {
          set({ isLoading: false });
          get().incrementLoginAttempts();
          throw error;
        }
      },

      signInWithOAuth: async (provider: 'google' | 'apple') => {
        set({ isLoading: true });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/oauth/${provider}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: 'mock-oauth-token' }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'OAuth login failed');
          }

          localStorage.setItem('token', data.token);

          set({
            user: data.user,
            role: data.user.role,
            isLoading: false,
          });
          get().resetLoginAttempts();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });
          
          const token = localStorage.getItem('token');
          if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          }

          localStorage.removeItem('token');
          set({ user: null, role: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          // Still clear local state even if API call fails
          localStorage.removeItem('token');
          set({ user: null, role: null });
        }
      },

      resetPassword: async (email: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to send reset email');
          }
        } catch (error) {
          throw error;
        }
      },
    }),
    // ... rest of persist config
  )
);
```

### 3. Create API Service

Create a centralized API service:

```javascript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // Student endpoints
  async getStudentDashboard() {
    return this.request('/students/dashboard');
  }

  async getStudentGrades() {
    return this.request('/students/grades');
  }

  async getStudentAttendance() {
    return this.request('/students/attendance');
  }

  async getStudentPerformance() {
    return this.request('/students/performance');
  }

  // Teacher endpoints
  async getTeacherDashboard() {
    return this.request('/teachers/dashboard');
  }

  async getTeacherPerformance() {
    return this.request('/teachers/performance');
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminPerformance() {
    return this.request('/admin/performance');
  }

  // Search endpoint
  async search(query: string, type?: string) {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    
    return this.request(`/search?${params}`);
  }
}

export const apiService = new ApiService();
```

### 4. Update Search Store

```javascript
// src/stores/searchStore.ts
import { apiService } from '../services/api';

export const useSearchStore = create<SearchState>((set) => ({
  // ... existing state

  search: async (query: string, role?: 'student' | 'teacher' | 'admin') => {
    if (!query.trim()) {
      set({ results: [], query: '' });
      return;
    }

    set({ isLoading: true, error: null, query });

    try {
      const response = await apiService.search(query);
      
      set({ 
        results: response.data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false 
      });
    }
  },

  // ... rest of the store
}));
```

### 5. Update Data Store

```javascript
// src/stores/dataStore.ts
import { apiService } from '../services/api';

export const useDataStore = create<DataState>((set, get) => ({
  // ... existing state

  // Replace mock implementations with real API calls
  fetchStudentData: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await apiService.getStudentDashboard();
      // Update your state with real data
      set({ isLoading: false });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch data';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // ... other methods
}));
```

## 🔐 Authentication Flow

1. **User logs in** → Frontend sends credentials to backend
2. **Backend validates** → Returns JWT token + user data
3. **Frontend stores token** → In localStorage
4. **All API requests** → Include token in Authorization header
5. **Token expires** → Backend returns 401, frontend redirects to login

## 🚀 Testing the Integration

1. **Start your backend** on EC2
2. **Update frontend env** with backend URL
3. **Test login** with demo credentials:
   - Student: `student@dpsb.edu` / `student123`
   - Teacher: `teacher@dpsb.edu` / `teacher123`
   - Admin: `admin@dpsb.edu` / `admin123`

## 🔧 CORS Configuration

Your backend already includes CORS configuration. Make sure the `FRONTEND_URL` in your backend `.env` matches your frontend domain:

```bash
# Backend .env
FRONTEND_URL=https://your-frontend-domain.com
```

## 📱 Production Deployment

1. **Backend**: Deploy to EC2 (as per guide above)
2. **Frontend**: Deploy to Netlify/Vercel/S3
3. **Domain**: Point your domain to both services
4. **SSL**: Enable HTTPS for both frontend and backend

Your full-stack application is now ready! 🎉