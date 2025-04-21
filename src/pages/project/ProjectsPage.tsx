
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

// Mock projects data - will be replaced with Supabase data
const MOCK_PROJECTS = [
  {
    id: "1",
    title: "AI-Powered Meal Planning App",
    description: "Building an app that uses AI to create personalized meal plans based on dietary preferences, allergies, and nutritional goals. Looking for developers with React Native and ML experience.",
    stage: "prototype" as ProjectStage,
    owner: {
      id: "101",
      name: "Emma Johnson",
      avatarUrl: "",
    },
    skills: ["React Native", "Machine Learning", "UI/UX Design", "Node.js"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Sustainable Fashion Marketplace",
    description: "Creating a platform to connect eco-conscious consumers with sustainable fashion brands. Features will include carbon footprint tracking and ethical supply chain verification.",
    stage: "idea" as ProjectStage,
    owner: {
      id: "102",
      name: "Liam Chen",
      avatarUrl: "",
    },
    skills: ["React", "UI/UX Design", "Digital Marketing", "Product Management"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "AR Educational Platform for STEM Learning",
    description: "Developing an augmented reality platform to make STEM subjects more engaging for middle school students. The app will visualize complex scientific concepts in 3D.",
    stage: "mvp" as ProjectStage,
    owner: {
      id: "103",
      name: "Sofia Rodriguez",
      avatarUrl: "",
    },
    skills: ["AR/VR", "Unity", "3D Modeling", "Education Content"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Mental Health Tracker for Students",
    description: "Developing a mobile app for students to track their mental well-being, set goals, and access resources. The app will include mood tracking, guided meditations, and anonymous peer support.",
    stage: "concept" as ProjectStage,
    owner: {
      id: "104",
      name: "Nathan Park",
      avatarUrl: "",
    },
    skills: ["React Native", "Firebase", "UI/UX Design", "Psychology"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "Peer-to-Peer Textbook Exchange",
    description: "Building a platform for students to buy, sell, and trade textbooks within their university. Features include price comparison, condition ratings, and in-app messaging.",
    stage: "mvp" as ProjectStage,
    owner: {
      id: "105",
      name: "Olivia Taylor",
      avatarUrl: "",
    },
    skills: ["React", "Node.js", "MongoDB", "Payment Processing"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Campus Event Discovery App",
    description: "Creating a centralized platform for finding and promoting campus events, club activities, and networking opportunities. Includes personalized recommendations and calendar integration.",
    stage: "growth" as ProjectStage,
    owner: {
      id: "106",
      name: "Marcus Williams",
      avatarUrl: "",
    },
    skills: ["React Native", "GraphQL", "UX Research", "Marketing"],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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

  useEffect(() => {
    // Simulate loading projects data
    const loadProjects = async () => {
      try {
        // After Supabase integration, this will fetch actual projects
        setTimeout(() => {
          setProjects(MOCK_PROJECTS);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading projects:", error);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Apply filters to projects
  const filteredProjects = projects.filter((project) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Stage filter
    const matchesStage = !stageFilter || project.stage === stageFilter;

    // Skills filter
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => project.skills.includes(skill));

    return matchesSearch && matchesStage && matchesSkills;
  });

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <Layout>
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
                  value={stageFilter || ""}
                  onValueChange={(value) => setStageFilter(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Stages</SelectItem>
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
                Try adjusting your search or filters to find what you're looking for.
              </p>
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
