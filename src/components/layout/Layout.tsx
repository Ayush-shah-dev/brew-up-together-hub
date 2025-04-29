
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { checkAuth } from "@/lib/auth";

interface UserProfile {
  id: string;
  email: string;
  avatarUrl?: string;
}

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  isAuthenticated?: boolean;
  userProfile?: UserProfile;
}

const Layout = ({ children, requireAuth = false, isAuthenticated: propIsAuthenticated, userProfile: propUserProfile }: LayoutProps) => {
  const [user, setUser] = useState<UserProfile | null>(propUserProfile || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(propIsAuthenticated ?? false);
  const [loading, setLoading] = useState(!propUserProfile && !propIsAuthenticated);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  useEffect(() => {
    // If props are provided, use them directly
    if (propIsAuthenticated !== undefined) {
      setIsAuthenticated(propIsAuthenticated);
      if (propUserProfile) {
        setUser(propUserProfile);
      }
      setLoading(false);
      setAuthChecked(true);
      return;
    }

    const loadUser = async () => {
      try {
        const userData = await checkAuth();
        setIsAuthenticated(!!userData);
        setUser(userData);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    loadUser();
  }, [propIsAuthenticated, propUserProfile]);

  useEffect(() => {
    // Only redirect after auth check is complete and not during initial load
    if (!loading && authChecked) {
      if (requireAuth && !isAuthenticated) {
        // Store the current location to redirect back after login
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        toast.error("Please log in to access this page");
        navigate(`/login?returnTo=${returnUrl}`);
      } else if (isAuthenticated && isAuthPage) {
        navigate("/dashboard");
      }
    }
  }, [loading, authChecked, requireAuth, isAuthenticated, navigate, isAuthPage, location.pathname, location.search]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} userProfile={user || undefined} />
      <main className="flex-grow pt-16">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cobrew-600"></div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
