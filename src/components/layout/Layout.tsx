
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  userProfile?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
}

const Layout = ({ children, isAuthenticated = false, userProfile = null }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} userProfile={userProfile} />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
