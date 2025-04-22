import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  userProfile?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      if (activeSession?.user) {
        fetchUserProfile(activeSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && requireAuth && !session) {
      toast.error("Please log in to access this page");
      navigate("/login");
    }
    
    if (!loading && session && isAuthPage) {
      navigate("/");
    }
  }, [loading, requireAuth, session, navigate, isAuthPage]);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    setUserProfile(data);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={!!session} userProfile={userProfile} />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
