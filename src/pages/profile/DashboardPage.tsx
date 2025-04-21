
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectCard, { ProjectStage } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Mock user profile data - will be replaced with Supabase data
const MOCK_USER = {
  id: "101",
  name: "Alex Johnson",
  title: "Full Stack Developer",
  bio: "I'm a Computer Science student passionate about building solutions that solve real-world problems.",
  avatarUrl: "",
  skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
  profileComplete: true,
};

// Mock user projects
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "AI-Powered Meal Planning App",
    description: "Building an app that uses AI to create personalized meal plans based on dietary preferences, allergies, and nutritional goals. Looking for developers with React Native and ML experience.",
    stage: "prototype" as ProjectStage,
    owner: {
      id: "101",
      name: "Alex Johnson",
      avatarUrl: "",
    },
    skills: ["React Native", "Machine Learning", "UI/UX Design", "Node.js"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isOwner: true,
  },
  {
    id: "2",
    title: "Student Collaboration Platform",
    description: "Creating a platform for students to collaborate on projects, share resources, and build portfolios. Features include project matching, skill verification, and integrations with GitHub and educational platforms.",
    stage: "mvp" as ProjectStage,
    owner: {
      id: "101",
      name: "Alex Johnson",
      avatarUrl: "",
    },
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    isOwner: true,
  },
];

// Mock collaborations (projects the user is contributing to but doesn't own)
const MOCK_COLLABORATIONS = [
  {
    id: "3",
    title: "AR Educational Platform for STEM Learning",
    description: "Developing an augmented reality platform to make STEM subjects more engaging for middle school students. The app will visualize complex scientific concepts in 3D.",
    stage: "concept" as ProjectStage,
    owner: {
      id: "103",
      name: "Sofia Rodriguez",
      avatarUrl: "",
    },
    skills: ["AR/VR", "Unity", "3D Modeling", "Education Content"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isOwner: false,
  },
];

// Mock applications
const MOCK_APPLICATIONS = [
  {
    id: "app1",
    project: {
      id: "4",
      title: "Mental Health Tracker for Students",
      stage: "concept" as ProjectStage,
      owner: {
        id: "104",
        name: "Nathan Park",
        avatarUrl: "",
      },
    },
    status: "pending",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "app2",
    project: {
      id: "5",
      title: "Peer-to-Peer Textbook Exchange",
      stage: "mvp" as ProjectStage,
      owner: {
        id: "105",
        name: "Olivia Taylor",
        avatarUrl: "",
      },
    },
    status: "accepted",
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "not1",
    type: "application",
    title: "New Application",
    content: "Maria Davis has applied to join your AI-Powered Meal Planning App project",
    isRead: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    linkTo: "/dashboard/applications",
  },
  {
    id: "not2",
    type: "message",
    title: "New Message",
    content: "You have a new message from David Chen",
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    linkTo: "/messages",
  },
  {
    id: "not3",
    type: "application_update",
    title: "Application Accepted",
    content: "Your application to join Peer-to-Peer Textbook Exchange has been accepted",
    isRead: true,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    linkTo: "/projects/5",
  },
];

// Mock stats
const MOCK_STATS = {
  projectsCreated: 2,
  projectsJoined: 1,
  applicationsPending: 1,
  messagesUnread: 3,
};

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboard = async () => {
      try {
        // After Supabase integration, this will fetch actual user data
        setTimeout(() => {
          setUser(MOCK_USER);
          setProjects(MOCK_PROJECTS);
          setCollaborations(MOCK_COLLABORATIONS);
          setApplications(MOCK_APPLICATIONS);
          setNotifications(MOCK_NOTIFICATIONS);
          setStats(MOCK_STATS);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
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

  if (!user.profileComplete) {
    return (
      <Layout isAuthenticated={true} userProfile={user}>
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
    <Layout isAuthenticated={true} userProfile={user}>
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
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-cobrew-100 text-cobrew-800">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{user.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {skill}
                      </Badge>
                    ))}
                    {user.skills.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100">
                        +{user.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
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
                      {stats.projectsCreated}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Projects Joined</span>
                    <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                      {stats.projectsJoined}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Applications</span>
                    <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                      {stats.applicationsPending}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unread Messages</span>
                    <Badge variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                      {stats.messagesUnread}
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
