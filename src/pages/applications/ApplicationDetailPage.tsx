
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApplicationDetailPage = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/login');
          return;
        }

        if (!applicationId) {
          navigate('/applications');
          return;
        }

        // First fetch the application
        const { data: applicationData, error: applicationError } = await supabase
          .from('project_applications')
          .select('*')
          .eq('id', applicationId)
          .single();
          
        if (applicationError) {
          console.error('Error fetching application:', applicationError);
          toast.error('Failed to load application details');
          navigate('/applications');
          return;
        }

        if (!applicationData) {
          navigate('/applications');
          return;
        }

        // Then fetch the project separately
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', applicationData.project_id)
          .single();
          
        if (projectError) {
          console.error('Error fetching project:', projectError);
        }

        // Fetch applicant details separately
        const { data: applicantData, error: applicantError } = await supabase
          .from('profiles')
          .select('email, avatar_url')
          .eq('id', applicationData.applicant_id)
          .single();

        if (applicantError) {
          console.error('Error fetching applicant:', applicantError);
        }

        // Combine the data
        const completeApplication = {
          ...applicationData,
          projects: projectData || null,
          applicant: applicantData || { email: 'Unknown', avatar_url: null }
        };

        setApplication(completeApplication);
        
        // Check if current user is project owner
        const projectCreatorId = projectData ? projectData.creator_id : null;
        setIsOwner(projectCreatorId === session.user.id);

        // If user is neither the applicant nor the project owner, redirect
        if (applicationData.applicant_id !== session.user.id && 
            projectCreatorId !== session.user.id) {
          toast.error('You do not have permission to view this application');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading application details:', error);
        toast.error('Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    };

    loadApplication();
  }, [applicationId, navigate]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('project_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
        
      if (error) {
        throw error;
      }
      
      setApplication({
        ...application,
        status: newStatus
      });
      
      toast.success(`Application ${newStatus === 'accepted' ? 'accepted' : 'rejected'}`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Layout requireAuth={true}>
        <div className="min-h-screen py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout requireAuth={true}>
        <div className="min-h-screen py-16 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Application Not Found</h1>
            <p className="text-gray-600 mb-6">The application you're looking for doesn't exist or has been removed.</p>
            <Button 
              className="bg-cobrew-600 hover:bg-cobrew-700"
              onClick={() => navigate('/applications')}
            >
              Back to Applications
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth={true}>
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Application Details</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{application.projects?.title || "Project"}</CardTitle>
                <Badge
                  className={
                    application.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {application.status === 'pending' ? 'Pending Review' : 
                   application.status === 'accepted' ? 'Accepted' : 'Rejected'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={application.applicant?.avatar_url} />
                  <AvatarFallback>
                    {getInitials(application.applicant?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="font-medium">{application.applicant?.email}</div>
                  <div className="text-sm text-gray-500">Applied on {formatDate(application.created_at)}</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-2">Application Message</h3>
                <div className="whitespace-pre-line text-gray-700">
                  {application.message}
                </div>
              </div>
              
              {isOwner && application.status === 'pending' && (
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate('rejected')}
                  >
                    Reject Application
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate('accepted')}
                  >
                    Accept Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>About the Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{application.projects?.description || "No description available."}</p>
              <Button 
                className="bg-cobrew-600 hover:bg-cobrew-700"
                onClick={() => navigate(`/projects/${application.project_id}`)}
              >
                View Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationDetailPage;
