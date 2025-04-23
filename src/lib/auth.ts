
import { authApi, setAuthToken } from "@/services/api";
import { toast } from "sonner";

interface AuthUser {
  id: string;
  email: string;
  avatarUrl?: string;
}

// Check if user is already logged in on page load
export const checkAuth = async (): Promise<AuthUser | null> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await authApi.getCurrentUser();
    return response.user;
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem("token");
    return null;
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const response = await authApi.login(email, password);
    
    if (response.token && response.user) {
      setAuthToken(response.token);
      toast.success("Login successful");
      return response.user;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
    throw error;
  }
};

// Register user
export const registerUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const response = await authApi.register(email, password);
    
    if (response.token && response.user) {
      setAuthToken(response.token);
      toast.success("Registration successful");
      return response.user;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    const message = error.response?.data?.message || "Registration failed";
    toast.error(message);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await authApi.logout();
    toast.success("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
