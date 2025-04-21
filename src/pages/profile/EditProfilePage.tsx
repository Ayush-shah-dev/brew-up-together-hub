
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

// Mock profile data - will be replaced with Supabase data fetch
const MOCK_PROFILE = {
  fullName: "Alex Johnson",
  title: "Full Stack Developer",
  bio: "I'm a Computer Science student passionate about building solutions that solve real-world problems. Experienced in web and mobile development with a focus on clean, maintainable code.",
  location: "San Francisco, CA",
  education: "Stanford University, Computer Science",
  website: "https://alexjohnson.dev",
  linkedin: "https://linkedin.com/in/alexjohnson",
  github: "https://github.com/alexjohnson",
  twitter: "https://twitter.com/alexjohnson",
  skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
  interests: ["Web Development", "AI/Machine Learning", "EdTech", "SaaS"],
  lookingFor: ["Co-Founder", "Frontend Developer", "Backend Developer", "UI/UX Designer"],
  availability: "part-time",
  isPublic: true,
};

const EditProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading profile data
    const loadProfile = async () => {
      try {
        // After Supabase integration, this will fetch actual user profile
        setTimeout(() => {
          setProfile(MOCK_PROFILE);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error loading profile:", error);
        navigate("/dashboard");
      }
    };

    loadProfile();
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen py-16 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Keep your profile updated to find the best collaboration opportunities
          </p>
        </div>
        
        <div className="w-full max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-10 w-1/3 mx-auto" />
            </div>
          ) : (
            <ProfileForm initialData={profile} isEditing={true} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditProfilePage;
