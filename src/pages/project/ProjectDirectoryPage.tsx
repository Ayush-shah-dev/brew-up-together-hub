
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

/**
 * ProjectDirectoryPage - Redirects to projects page
 * 
 * This component serves as a redirect to the main projects page
 * for better URL structure and backward compatibility.
 */
const ProjectDirectoryPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /projects (the main projects listing page)
    navigate("/projects");
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen py-16 flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirecting to projects page...</p>
      </div>
    </Layout>
  );
};

export default ProjectDirectoryPage;
