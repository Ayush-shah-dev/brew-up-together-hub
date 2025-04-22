
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectApplication from "@/components/project/ProjectApplication";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProjectApplicationPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        
        if (!projectId) {
          navigate('/projects');
          return;
        }
        
        // Get current user session to check authentication
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast.error("You must be logged in to apply for projects");
          navigate('/login');
          return;
        }
        
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (projectError) {
          console.error("Error loading project:", projectError);
          toast.error("Failed to load project details");
          navigate('/projects');
          return;
        }
        
        if (!projectData) {
          toast.error("Project not found");
          navigate('/projects');
          return;
        }
        
        // Check if the user is the project creator (can't apply to own project)
        if (projectData.creator_id === session.user.id) {
          toast.error("You cannot apply to your own project");
          navigate(`/projects/${projectId}`);
          return;
        }
        
        // Check if the user has already applied to this project
        const { data: existingApplication, error: applicationError } = await supabase
          .from('project_applications')
          .select('*')
          .eq('project_id', projectId)
          .eq('applicant_id', session.user.id);
          
        if (applicationError) {
          console.error("Error checking existing application:", applicationError);
        } else if (existingApplication && existingApplication.length > 0) {
          toast.error("You have already applied to this project");
          navigate(`/projects/${projectId}`);
          return;
        }
        
        setProject(projectData);
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, navigate]);

  return (
    <Layout requireAuth={true}>
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
