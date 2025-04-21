
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectApplication from "@/components/project/ProjectApplication";
import { Skeleton } from "@/components/ui/skeleton";

// Mock project data - will be replaced with Supabase data
const MOCK_PROJECT = {
  id: "1",
  title: "AI-Powered Meal Planning App",
};

const ProjectApplicationPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading project data
    const loadProject = async () => {
      try {
        // After Supabase integration, this will fetch actual project data based on projectId
        setTimeout(() => {
          setProject(MOCK_PROJECT);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading project:", error);
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return (
    <Layout>
      <div className="min-h-screen py-16 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apply to Join Project</h1>
          <p className="mt-2 text-gray-600">
            Tell the project team why you'd be a great addition
          </p>
        </div>
        
        <div className="w-full max-w-3xl">
          {isLoading ? (
            <div className="space-y-4 bg-white p-8 rounded-lg shadow-sm">
              <Skeleton className="h-10 w-1/2 mx-auto" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex justify-end space-x-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ) : (
            <ProjectApplication 
              projectId={projectId} 
              projectTitle={project?.title || "Project"} 
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectApplicationPage;
