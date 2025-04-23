
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to handle errors
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  const message = error.response?.data?.message || "An unexpected error occurred";
  toast.error(message);
  return Promise.reject(error);
};

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Set token to localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

// API request function with auth header
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config: RequestInit = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      
      // Handle API errors
      if (!response.ok) {
        const error = {
          status: response.status,
          message: data.message || "An error occurred",
          response: { data }
        };
        return handleApiError(error);
      }
      
      return data;
    } else {
      // Handle non-JSON responses
      if (!response.ok) {
        const error = {
          status: response.status,
          message: "An error occurred",
          response: { data: await response.text() }
        };
        return handleApiError(error);
      }
      
      return await response.text();
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
    
  register: (email: string, password: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
    
  logout: () => {
    removeAuthToken();
    return apiRequest("/auth/logout", { method: "POST" });
  },
  
  getCurrentUser: () => apiRequest("/auth/me")
};

// Projects API
export const projectsApi = {
  getProjects: (filters?: { search?: string; stage?: string; skills?: string[] }) => {
    let queryString = "";
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.stage) params.append("stage", filters.stage);
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => params.append("skills", skill));
      }
      queryString = `?${params.toString()}`;
    }
    
    return apiRequest(`/projects${queryString}`);
  },
  
  getProject: (id: string) => apiRequest(`/projects/${id}`),
  
  createProject: (projectData: any) =>
    apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData)
    }),
    
  updateProject: (id: string, projectData: any) =>
    apiRequest(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData)
    }),
    
  deleteProject: (id: string) =>
    apiRequest(`/projects/${id}`, {
      method: "DELETE"
    })
};

// Applications API
export const applicationsApi = {
  submitApplication: (applicationData: any) =>
    apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify(applicationData)
    }),
    
  getApplications: (type: "submitted" | "received") =>
    apiRequest(`/applications?type=${type}`),
    
  getApplication: (id: string) =>
    apiRequest(`/applications/${id}`),
    
  updateApplicationStatus: (id: string, status: "pending" | "approved" | "rejected") =>
    apiRequest(`/applications/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    })
};

// Profiles API
export const profilesApi = {
  getMyProfile: () => apiRequest("/profiles/me"),
  
  getUserProfile: (userId: string) =>
    apiRequest(`/profiles/${userId}`),
    
  updateProfile: (profileData: any) =>
    apiRequest("/profiles", {
      method: "PUT",
      body: JSON.stringify(profileData)
    })
};

// Messages API
export const messagesApi = {
  getMessages: (projectId: string) =>
    apiRequest(`/messages/${projectId}`),
    
  sendMessage: (projectId: string, content: string) =>
    apiRequest(`/messages/${projectId}`, {
      method: "POST",
      body: JSON.stringify({ content })
    })
};
