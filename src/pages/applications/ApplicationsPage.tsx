import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
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
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);

        const { data: myProjects, error: projectsError } = await supabase
          .from('projects')
          .select('id, title')
          .eq('creator_id', session.user.id);
          
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          toast.error("Failed to load your projects");
          setIsLoading(false);
          return;
        }

        console.log("My projects:", myProjects);

        let receivedApplications = [];
        if (myProjects && myProjects.length > 0) {
          const projectIds = myProjects.map(p => p.id);
          
          const { data: receivedApps, error: receivedAppsError } = await supabase
            .from('project_applications')
            .select(`
              id, 
              project_id, 
              applicant_id, 
              introduction,
              experience,
              motivation,
              status, 
              created_at
            `)
            .in('project_id', projectIds);
            
          if (receivedAppsError) {
            console.error('Error fetching received applications:', receivedAppsError);
            toast.error("Failed to load applications for your projects");
          } else if (receivedApps && receivedApps.length > 0) {
            console.log("Received applications:", receivedApps);
            
            const enhancedApps = await Promise.all(
              receivedApps.map(async (app) => {
                const projectInfo = myProjects.find(p => p.id === app.project_id);
                
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
            
            receivedApplications = enhancedApps;
          }
        }
        
        setApplications(receivedApplications);
        console.log("Final received applications:", receivedApplications);

        const { data: sentApps, error: sentAppsError } = await supabase
          .from('project_applications')
          .select(`
            id, 
            project_id, 
            applicant_id, 
            introduction,
            experience,
            motivation,
            status, 
            created_at
          `)
          .eq('applicant_id', session.user.id);
          
        if (sentAppsError) {
          console.error('Error fetching sent applications:', sentAppsError);
          toast.error("Failed to load your submitted applications");
        } else if (sentApps && sentApps.length > 0) {
          console.log("Sent applications:", sentApps);
          
          const enhancedSentApps = await Promise.all(
            sentApps.map(async (app) => {
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
          
          setSentApplications(enhancedSentApps);
          console.log("Final sent applications:", enhancedSentApps);
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
                  {applications && applications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Introduction</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Motivation</TableHead>
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
                            <TableCell className="max-w-[200px] truncate">
                              {application.introduction}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {application.experience}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {application.motivation}
                            </TableCell>
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
                  {sentApplications && sentApplications.length > 0 ? (
                    <div className="divide-y">
                      {sentApplications.map((application) => {
                        return (
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
                            <p className="text-sm text-gray-600 mb-4">
                              Applied on {formatDate(application.created_at)}
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Introduction</h4>
                                <p className="text-gray-700 line-clamp-3">{application.introduction}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Experience</h4>
                                <p className="text-gray-700 line-clamp-3">{application.experience}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Motivation</h4>
                                <p className="text-gray-700 line-clamp-3">{application.motivation}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
