import apiClient from '../lib/api';

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (credentials) => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  getCurrentUser: async () => {
    // This would need to be implemented based on how the backend verifies tokens
    // For now, we'll return a mock user or handle this differently
    throw new Error('Not implemented - would require token verification');
  },

  // Note: Profile update and password change would need separate endpoints
  // These are not implemented in the current backend
};

// Properties API
export const propertiesAPI = {
  getAll: async (params) => {
    const { data } = await apiClient.get('/properties', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/properties/${id}`);
    return data;
  },

  create: async (propertyData) => {
    const { data } = await apiClient.post('/properties', propertyData);
    return data;
  },

  update: async (id, propertyData) => {
    const { data } = await apiClient.put(`/properties/${id}`, propertyData);
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
  },

  uploadImages: async (propertyId, files) => {
    // files may be either an array of File or a FormData (in case caller pre-made it)
    let formData = files instanceof FormData ? files : new FormData();
    if (!(files instanceof FormData)) {
      (files || []).forEach((file) => formData.append('images[]', file));
    }
    // Do NOT set Content-Type header manually — axios/browser will set boundary for multipart/form-data
    // Also ensure we don't send the `Content-Type` header without boundary as a misconfigured header can cause parsing failures
    // Use fetch for file uploads to avoid axios headers overriding/boundary issues
    const token = localStorage.getItem('token');
    const baseUrl = apiClient.defaults.baseURL || '';
    const url = baseUrl.replace(/\/$/, '') + `/properties/${propertyId}/images`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Failed to upload images');
    return data;
  },
};

// Inquiries API
// Inquiries API removed — use direct contact channels

// Contact API
export const contactAPI = {
  sendMessage: async (messageData) => {
    const { data } = await apiClient.post('/contact', messageData);
    return data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    // Dashboard endpoint returns { success: true, data: stats }
    // Return the inner stats object to make it easier for callers
    return data.data;
  },
};

// User Management API
export const userAPI = {
  // Agent-specific endpoints
  getAgentStats: async () => {
    const { data } = await apiClient.get('/agent/stats');
    return data.data;
  },
  // Get clients for a specific agent (admin only)
  getAgentClients: async (agentId) => {
    const { data } = await apiClient.get(`/users/agents/${agentId}/clients`);
    return data.data || [];
  },
  addClient: async (clientData) => {
    const { data } = await apiClient.post('/agent/clients', clientData);
    return data.data;
  },
  updateClient: async (clientId, clientData) => {
    const { data } = await apiClient.put(
      `/agent/clients/${clientId}`,
      clientData
    );
    return data.data;
  },

  deleteClient: async (clientId) => {
    const { data } = await apiClient.delete(`/agent/clients/${clientId}`);
    return data.data;
  },

  updatePassword: async (passwordData) => {
    const { data } = await apiClient.put('/auth/change-password', passwordData);
    return data.data;
  },
  // Get all users (admin only)
  getAll: async () => {
    const { data } = await apiClient.get('/users');
    return data.data;
  },

  // Create a new user (admin only)
  create: async (userData) => {
    const { data } = await apiClient.post('/users', userData);
    return data.data;
  },

  // Delete a user (admin only)
  delete: async (userId) => {
    const { data } = await apiClient.delete(`/users/${userId}`);
    return data;
  },

  // Update user role (admin only)
  updateRole: async (userId, role) => {
    const { data } = await apiClient.put(`/users/${userId}/role`, { role });
    return data.data;
  },

  // Toggle agent status (admin only)
  toggleStatus: async (userId, isActive) => {
    const { data } = await apiClient.patch(`/users/${userId}/status`, {
      isActive,
    });
    return data.data;
  },

  // Get user by ID (admin only)
  getById: async (userId) => {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data.data;
  },
};
