
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [sentApplications, setSentApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);

        // Load received applications (for projects I own)
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, title')
          .eq('creator_id', session.user.id);
          
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          toast.error("Failed to load your projects");
          return;
        }

        // If user has projects, fetch applications for those projects
        let receivedApplications = [];
        if (projectsData && projectsData.length > 0) {
          const projectIds = projectsData.map(p => p.id);
          
          // Get applications for user's projects
          const { data: receivedApplicationsData, error: receivedApplicationsError } = await supabase
            .from('project_applications')
            .select('*')
            .in('project_id', projectIds);
            
          if (receivedApplicationsError) {
            console.error('Error fetching received applications:', receivedApplicationsError);
            toast.error("Failed to load applications for your projects");
          } else if (receivedApplicationsData && receivedApplicationsData.length > 0) {
            // Process each application to add project and applicant info
            receivedApplications = await Promise.all(
              receivedApplicationsData.map(async (app) => {
                // Find project details from our already fetched projects
                const projectInfo = projectsData.find(p => p.id === app.project_id);
                
                // Get applicant profile
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('email, avatar_url')
                  .eq('id', app.applicant_id)
                  .single();
                
                if (profileError) {
                  console.error('Error fetching applicant profile:', profileError);
                }
                
                return {
                  ...app,
                  projects: projectInfo || { title: "Unknown Project" },
                  profiles: profileData || { email: "Unknown", avatar_url: null }
                };
              })
            );
          }
        }
        
        setApplications(receivedApplications);

        // Load sent applications (that I've submitted)
        const { data: sentApplicationsData, error: sentApplicationsError } = await supabase
          .from('project_applications')
          .select('*')
          .eq('applicant_id', session.user.id);
          
        if (sentApplicationsError) {
          console.error('Error fetching sent applications:', sentApplicationsError);
          toast.error("Failed to load your submitted applications");
        } else {
          // If we have sent applications, fetch related project data
          const enhancedSentApplications = await Promise.all(
            (sentApplicationsData || []).map(async (app) => {
              // Get project details
              const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('title, creator_id')
                .eq('id', app.project_id)
                .single();
              
              if (projectError) {
                console.error('Error fetching project details:', projectError);
                return {
                  ...app,
                  projects: { title: "Unknown Project" }
                };
              }
                
              return {
                ...app,
                projects: projectData
              };
            })
          );
          
          setSentApplications(enhancedSentApplications);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [navigate]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('project_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
        
      if (error) {
        throw error;
      }
      
      // Update the application in the state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      toast.success(`Application ${newStatus === 'accepted' ? 'accepted' : 'rejected'}`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold mb-6">Applications</h1>
            <Skeleton className="h-12 w-full rounded-lg mb-6" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth={true}>
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Applications</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          
          <Tabs defaultValue="received">
            <TabsList className="w-full bg-white rounded-lg mb-6">
              <TabsTrigger value="received">Received Applications</TabsTrigger>
              <TabsTrigger value="sent">Your Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="received">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Applications for Your Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={application.profiles?.avatar_url} />
                                <AvatarFallback>
                                  {getInitials(application.profiles?.email)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{application.profiles?.email}</span>
                            </TableCell>
                            <TableCell>
                              <Link 
                                to={`/projects/${application.project_id}`}
                                className="text-cobrew-600 hover:text-cobrew-800 font-medium"
                              >
                                {application.projects?.title}
                              </Link>
                            </TableCell>
                            <TableCell>{formatDate(application.created_at)}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/applications/${application.id}`)}
                                >
                                  View
                                </Button>
                                {application.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No applications received for your projects yet.</p>
                      <Button 
                        className="bg-cobrew-600 hover:bg-cobrew-700"
                        asChild
                      >
                        <Link to="/dashboard">Return to Dashboard</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sent">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Your Sent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {sentApplications.length > 0 ? (
                    <div className="divide-y">
                      {sentApplications.map((application) => (
                        <div key={application.id} className="py-4">
                          <div className="flex justify-between mb-2">
                            <Link 
                              to={`/projects/${application.project_id}`}
                              className="text-lg font-medium text-cobrew-600 hover:text-cobrew-800"
                            >
                              {application.projects?.title}
                            </Link>
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
                          <p className="text-sm text-gray-600">
                            Applied on {formatDate(application.created_at)}
                          </p>
                          <div className="mt-2">
                            <p className="text-gray-700">
                              {application.message?.length > 150 
                                ? `${application.message.substring(0, 150)}...` 
                                : application.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't applied to any projects yet.</p>
                      <Button 
                        className="bg-cobrew-600 hover:bg-cobrew-700"
                        asChild
                      >
                        <Link to="/projects">Browse Projects</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationsPage;
