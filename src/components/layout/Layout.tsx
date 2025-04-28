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

const Layout = ({ children, requireAuth = false, isAuthenticated, userProfile }: LayoutProps) => {
  const [user, setUser] = useState<UserProfile | null>(userProfile || null);
  const [loading, setLoading] = useState(!userProfile);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  useEffect(() => {
    if (isAuthenticated !== undefined && userProfile) {
      setUser(userProfile);
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const userData = await checkAuth();
        setUser(userData);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      toast.error("Please log in to access this page");
      navigate("/login");
    }
    
    if (!loading && user && isAuthPage) {
      navigate("/");
    }
  }, [loading, requireAuth, user, navigate, isAuthPage]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated || !!user} userProfile={userProfile || user || undefined} />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
