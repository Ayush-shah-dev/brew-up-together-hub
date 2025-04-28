
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectStage } from "@/components/project/ProjectCard";
import { projectsApi, applicationsApi } from "@/services/api";
import { checkAuth } from "@/lib/auth";
import { toast } from "sonner";

const stageLabels: Record<ProjectStage, string> = {
  idea: "Idea Stage",
  concept: "Concept Development",
  prototype: "Prototype",
  mvp: "Minimum Viable Product",
  growth: "Growth Stage",
  scaling: "Scaling",
};

const teamSizeLabels: Record<string, string> = {
  solo: "Solo (Just me)",
  small: "Small (2-3 people)",
  medium: "Medium (4-6 people)",
  large: "Large (7+ people)",
};

const commitmentLabels: Record<string, string> = {
  low: "Low (1-5 hours/week)",
  medium: "Medium (5-15 hours/week)",
  high: "High (15+ hours/week)",
};

const compensationLabels: Record<string, string> = {
  none: "None (Volunteer/Portfolio)",
  "revenue-share": "Revenue Sharing",
  equity: "Equity",
  paid: "Paid",
};

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        
        if (!projectId) return;
        
        // Get project details
        const projectData = await projectsApi.getProject(projectId);
        
        // Check if user has applied
        try {
          const user = await checkAuth();
          if (user) {
            const applications = await applicationsApi.getApplications("submitted");
            const existingApplication = applications.find(app => app.project.id === projectId);
            setHasApplied(!!existingApplication);
            
            // If user is project owner, check application count
            if (projectData.isOwner) {
              const receivedApplications = await applicationsApi.getApplications("received");
              const projectApplications = receivedApplications.filter(app => app.project.id === projectId);
              setApplicationCount(projectApplications.length);
            }
          }
        } catch (error) {
          console.error("Error checking applications:", error);
        }
        
        // Format project data
        const formattedProject = {
          ...projectData,
          hasApplied: hasApplied,
          team: [projectData.owner], // For now, just set team members to owner
          applications: applicationCount,
          website: "", // These fields don't exist in our DB yet
          repo: "", // These fields don't exist in our DB yet
          teamSize: projectData.tags?.[0] || "solo",
          commitment: projectData.tags?.[1] || "medium",
          compensation: projectData.tags?.[2] || "none",
          isRemote: projectData.tags?.[3] === "Remote",
          requiredSkills: projectData.rolesNeeded || [],
        };
        
        setProject(formattedProject);
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("Error loading project details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, hasApplied]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
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
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
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

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Project Not Found</h1>
            <p className="mt-2 text-gray-600">
              The project you're looking for doesn't exist or has been removed.
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
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant="outline" className="mb-2 bg-cobrew-50 text-cobrew-800">
                    {stageLabels[project.stage]}
                  </Badge>
                  <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  
                  <div className="flex items-center mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.owner.avatarUrl} />
                      <AvatarFallback className="bg-cobrew-100 text-cobrew-800 text-xs">
                        {getInitials(project.owner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <Link 
                        to={`/profile/${project.owner.id}`} 
                        className="text-sm font-medium hover:text-cobrew-600"
                      >
                        {project.owner.name}
                      </Link>
                      <p className="text-xs text-gray-500">{project.owner.title || "Project Owner"}</p>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      Created {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex gap-2">
                  {project.isOwner ? (
                    <Button 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/projects/${project.id}/edit`}>Edit Project</Link>
                    </Button>
                  ) : project.hasApplied ? (
                    <Button 
                      variant="outline" 
                      disabled
                    >
                      Application Submitted
                    </Button>
                  ) : (
                    <Button 
                      className="bg-cobrew-600 hover:bg-cobrew-700"
                      asChild
                    >
                      <Link to={`/projects/${project.id}/apply`}>Apply to Join</Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {project.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="details">
              <TabsList className="w-full border-t border-gray-200 justify-start rounded-none">
                <TabsTrigger value="details" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cobrew-600">
                  Project Details
                </TabsTrigger>
                <TabsTrigger value="team" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-cobrew-600">
                  Team
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="p-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">About the Project</h3>
                  <div className="whitespace-pre-line">
                    {project.description}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Current Team Size:</span>
                          <p className="font-medium">{teamSizeLabels[project.teamSize]}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Time Commitment:</span>
                          <p className="font-medium">{commitmentLabels[project.commitment]}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Compensation:</span>
                          <p className="font-medium">{compensationLabels[project.compensation]}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Remote Collaboration:</span>
                          <p className="font-medium">{project.isRemote ? "Available" : "Not Available"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Project Links</h3>
                      <div className="space-y-3">
                        {project.website && (
                          <div>
                            <span className="text-sm text-gray-500">Website:</span>
                            <p>
                              <a 
                                href={project.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-cobrew-600 hover:text-cobrew-800 font-medium"
                              >
                                {project.website}
                              </a>
                            </p>
                          </div>
                        )}
                        {project.repo && (
                          <div>
                            <span className="text-sm text-gray-500">Repository:</span>
                            <p>
                              <a 
                                href={project.repo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-cobrew-600 hover:text-cobrew-800 font-medium"
                              >
                                {project.repo}
                              </a>
                            </p>
                          </div>
                        )}
                        {!project.website && !project.repo && (
                          <p className="text-gray-500">No external links available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8 flex justify-center">
                  {project.isOwner ? (
                    <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200 max-w-md">
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">{project.applications}</span> people have applied to join your project
                      </p>
                      <Button 
                        className="bg-cobrew-600 hover:bg-cobrew-700"
                        asChild
                      >
                        <Link to="/applications">View Applications</Link>
                      </Button>
                    </div>
                  ) : !project.hasApplied && (
                    <div className="text-center max-w-md">
                      <p className="text-gray-700 mb-4">
                        Interested in joining this project? Apply now to connect with the team!
                      </p>
                      <Button 
                        className="bg-cobrew-600 hover:bg-cobrew-700"
                        asChild
                      >
                        <Link to={`/projects/${project.id}/apply`}>Apply to Join</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="p-6">
                <h3 className="text-lg font-semibold mb-4">Current Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.team.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-start p-4 border border-gray-200 rounded-lg"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="bg-cobrew-100 text-cobrew-800">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <Link 
                          to={`/profile/${member.id}`} 
                          className="font-medium hover:text-cobrew-600"
                        >
                          {member.name}
                        </Link>
                        <p className="text-sm text-gray-600">{member.title || "Team Member"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Looking for Collaborators</h3>
                  <p className="text-gray-600 max-w-lg mx-auto mb-4">
                    This project is actively seeking talented individuals with the following skills:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {project.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-cobrew-50 text-cobrew-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {!project.isOwner && !project.hasApplied && (
                    <Button 
                      className="bg-cobrew-600 hover:bg-cobrew-700"
                      asChild
                    >
                      <Link to={`/projects/${project.id}/apply`}>Apply to Join</Link>
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
