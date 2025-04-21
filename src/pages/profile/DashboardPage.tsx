
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

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          loadDashboardData(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      }
    );

    // Get current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        loadDashboardData(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
        const formattedProjects = projectsData.map(project => ({
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
        }));
        
        setProjects(formattedProjects);
      }
      
      // In a real implementation, you would fetch:
      // - Collaborations (projects user has joined)
      // - Applications (user's applications to join projects)
      // - Notifications
      // For now, we'll leave these empty since they require additional tables/relations
      setCollaborations([]);
      setApplications([]);
      setNotifications([]);
      
      // Set user stats
      setStats({
        projectsCreated: projectsData?.length || 0,
        projectsJoined: 0, // Would be populated in real implementation
        applicationsPending: 0, // Would be populated in real implementation
        messagesUnread: 0 // Would be populated in real implementation
      });
      
    } catch (error) {
      console.error("Error loading dashboard:", error);
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
      <Layout>
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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">You need to be logged in</h1>
            <p className="mt-2 text-gray-600">
              Please log in to access your dashboard
            </p>
            <Button 
              className="mt-4 bg-cobrew-600 hover:bg-cobrew-700"
              asChild
            >
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if profile is complete (in a real app you'd have a proper check)
  const profileComplete = true;

  if (!profileComplete) {
    return (
      <Layout isAuthenticated={true} userProfile={userProfile}>
        <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="mt-2 text-gray-600 mb-6">
              Please complete your profile to start using Co-Brew and connect with other students
            </p>
            <Button 
              className="bg-cobrew-600 hover:bg-cobrew-700"
              asChild
            >
              <Link to="/profile/create">Complete Profile</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAuthenticated={true} userProfile={userProfile}>
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
                    {collaborations.length > 0 ? (
                      collaborations.map((project) => (
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
                    )}
                  </div>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Your Applications</h3>
                    </div>
                    {applications.length > 0 ? (
                      <div className="divide-y">
                        {applications.map((application) => (
                          <div key={application.id} className="p-4 hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <Link 
                                  to={`/projects/${application.project.id}`}
                                  className="font-medium hover:text-cobrew-600"
                                >
                                  {application.project.title}
                                </Link>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="mr-2 text-xs">
                                    {application.project.stage === "concept" ? "Concept" :
                                      application.project.stage === "idea" ? "Idea" :
                                      application.project.stage === "prototype" ? "Prototype" :
                                      application.project.stage === "mvp" ? "MVP" :
                                      application.project.stage === "growth" ? "Growth" :
                                      "Scaling"}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    Owner: {application.project.owner.name}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 sm:mt-0 flex items-center">
                                <Badge
                                  className={`mr-3 ${
                                    application.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : application.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {application.status === "pending"
                                    ? "Pending"
                                    : application.status === "accepted"
                                    ? "Accepted"
                                    : "Rejected"}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Applied on {formatDate(application.appliedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
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
                    )}
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Recent Notifications</h3>
                    </div>
                    {notifications.length > 0 ? (
                      <div className="divide-y">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-cobrew-50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                <div className={`h-2 w-2 rounded-full ${!notification.isRead ? 'bg-cobrew-600' : 'bg-transparent'}`}></div>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(notification.timestamp)}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.content}
                                </p>
                                <div className="mt-2">
                                  <Link
                                    to={notification.linkTo}
                                    className="text-sm text-cobrew-600 hover:text-cobrew-800"
                                  >
                                    View {notification.type === "message" ? "Messages" : 
                                          notification.type === "application" ? "Application" : 
                                          "Details"}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-600">
                          You're all caught up! You'll see notifications about your projects, applications, and messages here.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
