
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
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  useEffect(() => {
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
  }, []);

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
      <Navbar isAuthenticated={!!user} userProfile={user || undefined} />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
