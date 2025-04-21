import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectCard, { ProjectStage } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadDashboardData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const loadDashboardData = async (userId) => {
    try {
      setIsLoading(true);
      
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setUserProfile(profileData);
      }
      
      // Load user's projects (created by them)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('creator_id', userId);
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      } else {
        // Format projects for ProjectCard component
        const formattedProjects = projectsData ? projectsData.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          stage: project.stage as ProjectStage,
          owner: {
            id: userId,
            name: profileData?.email || "You",
            avatarUrl: profileData?.avatar_url || "",
          },
          skills: project.roles_needed || [],
          createdAt: project.created_at,
          isOwner: true
        })) : [];
        
        setProjects(formattedProjects);
      }
      
      // Set user stats
      setStats({
        projectsCreated: projectsData?.length || 0,
        projectsJoined: 0,
        applicationsPending: 0,
        messagesUnread: 0
      });
      
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <Layout requireAuth={true}>
        <div className="min-h-screen py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg mt-6" />
              </div>
              <div className="md:w-3/4">
                <Skeleton className="h-12 w-full rounded-lg mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth={true}>
      {isLoading ? (
        <div className="min-h-screen py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg mt-6" />
              </div>
              <div className="md:w-3/4">
                <Skeleton className="h-12 w-full rounded-lg mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="md:w-1/4 space-y-6">
                {/* User Profile Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userProfile?.avatar_url} />
                        <AvatarFallback className="bg-cobrew-100 text-cobrew-800">
                          {getInitials(userProfile?.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <CardTitle className="text-lg">{userProfile?.email}</CardTitle>
                        <CardDescription>Student</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {userProfile?.bio || "No bio yet. Complete your profile to add more information."}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Dashboard Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Projects Created</span>
                      <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                        {stats?.projectsCreated || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Projects Joined</span>
                      <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                        {stats?.projectsJoined || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Applications</span>
                      <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                        {stats?.applicationsPending || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Unread Messages</span>
                      <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                        {stats?.messagesUnread || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-cobrew-600 hover:bg-cobrew-700"
                      asChild
                    >
                      <Link to="/projects/new">Create New Project</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/projects">Browse Projects</Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      asChild
                    >
                      <Link to="/messages">Check Messages</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="md:w-3/4">
                <Tabs defaultValue="projects">
                  <TabsList className="w-full bg-white rounded-lg mb-6">
                    <TabsTrigger value="projects">My Projects</TabsTrigger>
                    <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>

                  {/* My Projects Tab */}
                  <TabsContent value="projects">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            description={project.description}
                            stage={project.stage}
                            owner={project.owner}
                            skills={project.skills}
                            createdAt={project.createdAt}
                            isOwner={project.isOwner}
                          />
                        ))
                      ) : (
                        <div className="col-span-2 bg-white rounded-lg p-8 text-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                          <p className="text-gray-600 mb-6">
                            Start your entrepreneurial journey by creating your first project
                          </p>
                          <Button 
                            className="bg-cobrew-600 hover:bg-cobrew-700"
                            asChild
                          >
                            <Link to="/projects/new">Create Project</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Collaborations Tab */}
                  <TabsContent value="collaborations">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 bg-white rounded-lg p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No collaborations yet</h3>
                        <p className="text-gray-600 mb-6">
                          Join projects that match your skills and interests
                        </p>
                        <Button 
                          className="bg-cobrew-600 hover:bg-cobrew-700"
                          asChild
                        >
                          <Link to="/projects">Browse Projects</Link>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Applications Tab */}
                  <TabsContent value="applications">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <div className="p-4 border-b">
                        <h3 className="font-medium">Your Applications</h3>
                      </div>
                      <div className="p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-6">
                          Apply to projects that match your skills and interests
                        </p>
                        <Button 
                          className="bg-cobrew-600 hover:bg-cobrew-700"
                          asChild
                        >
                          <Link to="/projects">Browse Projects</Link>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent value="notifications">
                    <div className="bg-white rounded-lg overflow-hidden">
                      <div className="p-4 border-b">
                        <h3 className="font-medium">Recent Notifications</h3>
                      </div>
                      <div className="p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-600">
                          You're all caught up! You'll see notifications about your projects, applications, and messages here.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;
