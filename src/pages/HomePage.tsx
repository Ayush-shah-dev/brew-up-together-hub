
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProjectCard from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectStage } from "@/components/project/ProjectCard";

// Mock data for featured projects
const FEATURED_PROJECTS = [
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
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cobrew-700 to-cobrew-500 text-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center max-w-4xl leading-tight">
            Find Collaborators for Your Next Big Idea
          </h1>
          <p className="mt-4 text-xl text-center max-w-2xl text-white/80">
            Co-Brew connects student entrepreneurs with talented collaborators to turn innovative ideas into successful projects.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-white text-cobrew-700 hover:bg-white/90"
              asChild
            >
              <Link to="/signup">Join Co-Brew</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/projects">Browse Projects</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Search Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-lg shadow-sm">
              <Input
                type="text"
                placeholder="Search for projects or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 py-6 text-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {["Web Development", "Machine Learning", "Mobile Apps", "UI/UX Design", "Data Science", "Blockchain"].map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-sm py-1 px-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
            <Link to="/projects">
              <Button variant="outline">View All Projects</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROJECTS.map((project) => (
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Co-Brew Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-cobrew-100 mb-4">
                <span className="text-cobrew-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and build your profile showcasing your skills, experience, and interests.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-cobrew-100 mb-4">
                <span className="text-cobrew-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post or Find Projects</h3>
              <p className="text-gray-600">
                Share your startup idea or browse existing projects that match your interests and skills.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-cobrew-100 mb-4">
                <span className="text-cobrew-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate & Grow</h3>
              <p className="text-gray-600">
                Connect with fellow entrepreneurs, build your team, and bring your ideas to life.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-cobrew-600 hover:bg-cobrew-700"
              asChild
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-cobrew-200 flex items-center justify-center">
                  <span className="text-cobrew-800 font-medium">AJ</span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Alex Johnson</h3>
                  <p className="text-sm text-gray-500">Computer Science, Stanford</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I found an amazing team through Co-Brew to work on my AI startup idea. Within weeks, we had a working prototype!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-cobrew-200 flex items-center justify-center">
                  <span className="text-cobrew-800 font-medium">MP</span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Maya Patel</h3>
                  <p className="text-sm text-gray-500">Business, NYU</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a business student with a fintech idea, I needed technical co-founders. Co-Brew helped me connect with talented developers."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-cobrew-200 flex items-center justify-center">
                  <span className="text-cobrew-800 font-medium">TW</span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Tyler Washington</h3>
                  <p className="text-sm text-gray-500">Design, RISD</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've joined three projects through Co-Brew that perfectly matched my UI/UX skills. It's been amazing for my portfolio and network."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cobrew-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Bring Your Ideas to Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/80">
            Join a community of student entrepreneurs and collaborators today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-cobrew-700 hover:bg-white/90"
              asChild
            >
              <Link to="/signup">Create Account</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
