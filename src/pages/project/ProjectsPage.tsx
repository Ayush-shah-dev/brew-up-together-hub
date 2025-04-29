import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectCard, { ProjectStage } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { checkAuth } from "@/lib/auth";

// Skill options for filtering
const SKILL_OPTIONS = [
  "React",
  "React Native",
  "Machine Learning",
  "UI/UX Design",
  "Node.js",
  "Django",
  "Python",
  "Digital Marketing",
  "Product Management",
  "AR/VR",
  "Unity",
  "3D Modeling",
  "Firebase",
  "MongoDB",
  "GraphQL",
];

const ProjectsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth();
        if (user) {
          setIsAuthenticated(true);
          setUserProfile(user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkUserAuth();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Build filter object
        const filters: { search?: string; stage?: string; skills?: string[] } = {};
        if (searchQuery) filters.search = searchQuery;
        if (stageFilter) filters.stage = stageFilter;
        if (selectedSkills.length > 0) filters.skills = selectedSkills;
        
        const projectsData = await projectsApi.getProjects(filters);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load projects");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, stageFilter, selectedSkills]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredProjects = projects;

  return (
    <Layout isAuthenticated={isAuthenticated} userProfile={userProfile}>
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="mt-1 text-gray-600">
                Discover and collaborate on student-led startup projects
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                className="bg-cobrew-600 hover:bg-cobrew-700"
                asChild
              >
                <Link to="/projects/new">Create Project</Link>
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white shadow rounded-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search projects by title, description, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={stageFilter || "all"}
                  onValueChange={(value) => setStageFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="concept">Concept Development</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="mvp">Minimum Viable Product</SelectItem>
                    <SelectItem value="growth">Growth Stage</SelectItem>
                    <SelectItem value="scaling">Scaling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "More Filters"}
              </Button>
            </div>
            
            {showFilters && (
              <div className="mt-4">
                <Separator className="mb-4" />
                <h3 className="text-sm font-medium mb-2">Filter by skills needed:</h3>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <label
                        htmlFor={`skill-${skill}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
                
                {selectedSkills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Selected skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="bg-cobrew-100 text-cobrew-800 flex items-center"
                        >
                          {skill}
                          <button
                            className="ml-1 text-cobrew-800 hover:text-cobrew-600 focus:outline-none"
                            onClick={() => handleSkillToggle(skill)}
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="h-6 px-2 text-xs"
                        onClick={() => setSelectedSkills([])}
                      >
                        Clear all
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-8 w-5/6 mb-4" />
                    <Skeleton className="h-24 w-full mb-4" />
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-6 w-16" />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {projects.length === 0 
                  ? "Be the first to create a project!" 
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {projects.length === 0 ? (
                <Button 
                  className="bg-cobrew-600 hover:bg-cobrew-700"
                  asChild
                >
                  <Link to="/projects/new">Create Project</Link>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setStageFilter(null);
                    setSelectedSkills([]);
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
