
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  userProfile?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
}

const Layout = ({ children }: LayoutProps) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      if (activeSession?.user) {
        fetchUserProfile(activeSession.user.id);
      }
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
