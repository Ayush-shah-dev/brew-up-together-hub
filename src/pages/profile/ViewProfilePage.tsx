
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/components/project/ProjectCard";

// Mock user profile data - will be replaced with Supabase data
const MOCK_USER = {
  id: "101",
  name: "Alex Johnson",
  title: "Full Stack Developer",
  bio: "I'm a Computer Science student passionate about building solutions that solve real-world problems. Experienced in web and mobile development with a focus on clean, maintainable code.",
  avatarUrl: "",
  location: "San Francisco, CA",
  education: "Stanford University, Computer Science",
  website: "https://alexjohnson.dev",
  linkedin: "https://linkedin.com/in/alexjohnson",
  github: "https://github.com/alexjohnson",
  twitter: "https://twitter.com/alexjohnson",
  skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "Python", "Django", "UI/UX Design"],
  interests: ["Web Development", "AI/Machine Learning", "EdTech", "SaaS", "Mobile Apps"],
  lookingFor: ["Co-Founder", "Frontend Developer", "Backend Developer", "UI/UX Designer", "Product Manager"],
  availability: "part-time",
  createdAt: "2023-05-15T10:30:00Z",
  isCurrentUser: true,
};

// Mock user projects
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "AI-Powered Meal Planning App",
    description: "Building an app that uses AI to create personalized meal plans based on dietary preferences, allergies, and nutritional goals. Looking for developers with React Native and ML experience.",
    stage: "prototype",
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
    stage: "mvp",
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
    stage: "concept",
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

const ViewProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    // Simulate loading profile data
    const loadProfile = async () => {
      try {
        // After Supabase integration, this will fetch actual user data based on userId
        setTimeout(() => {
          setUser(MOCK_USER);
          setProjects(MOCK_PROJECTS);
          setCollaborations(MOCK_COLLABORATIONS);
          setIsCurrentUser(MOCK_USER.isCurrentUser);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading profile:", error);
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="p-6">
                <Skeleton className="h-40 w-full" />
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
            <h1 className="text-2xl font-bold text-gray-900">User Not Found</h1>
            <p className="mt-2 text-gray-600">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              className="mt-4 bg-cobrew-600 hover:bg-cobrew-700"
              asChild
            >
              <Link to="/projects">Browse Projects</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="bg-cobrew-100 text-cobrew-800 text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      <p className="text-gray-600">{user.title}</p>
                    </div>
                    {isCurrentUser ? (
                      <div className="mt-4 sm:mt-0">
                        <Button 
                          variant="outline"
                          asChild
                        >
                          <Link to="/profile/edit">Edit Profile</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 sm:mt-0">
                        <Button className="bg-cobrew-600 hover:bg-cobrew-700">
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.location && (
                      <Badge variant="outline" className="text-gray-600 bg-gray-100">
                        📍 {user.location}
                      </Badge>
                    )}
                    {user.education && (
                      <Badge variant="outline" className="text-gray-600 bg-gray-100">
                        🎓 {user.education}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-gray-600 bg-gray-100">
                      🕒 {user.availability === "full-time" 
                        ? "Full-time" 
                        : user.availability === "part-time" 
                        ? "Part-time" 
                        : user.availability === "weekends" 
                        ? "Weekends" 
                        : "Occasionally"}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600 bg-gray-100">
                      📅 Joined {formatDate(user.createdAt)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              {(user.website || user.linkedin || user.github || user.twitter) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {user.website && (
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      Website
                    </a>
                  )}
                  {user.linkedin && (
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-1-.02-2.285-1.39-2.285-1.39 0-1.605 1.087-1.605 2.207v4.256H8.013V8.124h2.55v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.212 1.778 3.212 4.092v4.34zM5.5 6.955a1.553 1.553 0 1 1-.002-3.106 1.553 1.553 0 0 1 .002 3.106zm1.334 9.383H4.166V8.124h2.668v8.214zM17.5 1H2.5C1.732 1 1 1.733 1 2.5v15c0 .767.732 1.5 1.5 1.5h15c.768 0 1.5-.733 1.5-1.5v-15c0-.767-.732-1.5-1.5-1.5z" clipRule="evenodd" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {user.github && (
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {user.twitter && (
                    <a 
                      href={user.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.338 8.338 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                      Twitter
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <Tabs defaultValue="skills">
              <TabsList className="w-full border-t border-gray-200 justify-start rounded-none">
                <TabsTrigger value="skills" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cobrew-600">
                  Skills & Interests
                </TabsTrigger>
                <TabsTrigger value="projects" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cobrew-600">
                  Projects & Collaborations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="skills" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Interests */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.interests && user.interests.length > 0 ? (
                          user.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No interests listed yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Looking For */}
                  <Card className="md:col-span-2">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Looking For</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.lookingFor && user.lookingFor.length > 0 ? (
                          user.lookingFor.map((role, index) => (
                            <Badge key={index} variant="outline" className="border-cobrew-200 bg-white">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">Not currently looking for specific roles</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="p-6">
                {/* User's Projects */}
                {projects.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((project) => (
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
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Collaborations */}
                {collaborations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Collaborations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {collaborations.map((project) => (
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
                      ))}
                    </div>
                  </div>
                )}
                
                {projects.length === 0 && collaborations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No projects or collaborations yet</p>
                    {isCurrentUser && (
                      <Button 
                        className="bg-cobrew-600 hover:bg-cobrew-700"
                        asChild
                      >
                        <Link to="/projects/new">Create Your First Project</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewProfilePage;
