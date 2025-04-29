
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectForm from "@/components/project/ProjectForm";
import { checkAuth } from "@/lib/auth";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await checkAuth();
        if (user) {
          setIsAuthenticated(true);
          setUserProfile(user);
        } else {
          // Clear any old data if not authenticated
          setIsAuthenticated(false);
          setUserProfile(null);
          
          // Store the current path to redirect back after login
          const returnUrl = encodeURIComponent('/projects/new');
          toast.error("You must be logged in to create a project");
          navigate(`/login?returnTo=${returnUrl}`);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Authentication error");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cobrew-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAuthenticated={isAuthenticated} userProfile={userProfile} requireAuth={true}>
      <div className="min-h-screen py-16 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">
            Share your project idea to find the perfect collaborators
          </p>
        </div>
        
        <div className="w-full max-w-3xl">
          <ProjectForm isEditing={false} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateProjectPage;
