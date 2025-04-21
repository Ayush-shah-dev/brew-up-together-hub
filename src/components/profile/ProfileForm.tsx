
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Define the validation schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal("")),
  github: z.string().url({ message: "Please enter a valid GitHub URL" }).optional().or(z.literal("")),
  twitter: z.string().url({ message: "Please enter a valid Twitter URL" }).optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  lookingFor: z.array(z.string()).optional(),
  availability: z.enum(["full-time", "part-time", "weekends", "occasionally"]),
  isPublic: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Skills options (these would typically come from a database)
const SKILLS_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "SEO",
  "Content Writing",
  "Data Analysis",
  "Machine Learning",
  "Blockchain",
  "AR/VR",
  "Mobile Development",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "Photography",
  "Video Editing",
  "Graphic Design",
  "3D Modeling",
  "Animation",
  "Game Development",
];

const INTERESTS_OPTIONS = [
  "Web Development",
  "Mobile Apps",
  "AI/Machine Learning",
  "Blockchain",
  "EdTech",
  "FinTech",
  "HealthTech",
  "Sustainability",
  "E-commerce",
  "SaaS",
  "Social Media",
  "Gaming",
  "AR/VR",
  "IoT",
  "Cybersecurity",
  "Cloud Computing",
  "Data Science",
  "Robotics",
  "Clean Energy",
  "Agriculture",
  "Transportation",
  "Food & Beverage",
  "Fashion",
  "Real Estate",
  "Entertainment",
  "Sports",
  "Travel",
  "Fitness",
  "Non-profit",
  "Mental Health",
];

const LOOKING_FOR_OPTIONS = [
  "Co-Founder",
  "Technical Lead",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "UI/UX Designer",
  "Product Manager",
  "Marketing Specialist",
  "Content Creator",
  "Social Media Manager",
  "Data Scientist",
  "Data Analyst",
  "DevOps Engineer",
  "QA Engineer",
  "Business Development",
  "Sales Representative",
  "Customer Support",
  "Graphic Designer",
  "Video Editor",
  "Financial Analyst",
  "Legal Advisor",
  "HR Manager",
  "Operations Manager",
  "Project Manager",
  "Mentor",
  "Advisor",
  "Investor",
];

const ProfileForm = ({ 
  initialData,
  isEditing = false
}: { 
  initialData?: Partial<ProfileFormValues>,
  isEditing?: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize the form with default values or editing data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      title: initialData?.title || "",
      bio: initialData?.bio || "",
      location: initialData?.location || "",
      education: initialData?.education || "",
      website: initialData?.website || "",
      linkedin: initialData?.linkedin || "",
      github: initialData?.github || "",
      twitter: initialData?.twitter || "",
      skills: initialData?.skills || [],
      interests: initialData?.interests || [],
      lookingFor: initialData?.lookingFor || [],
      availability: initialData?.availability || "part-time",
      isPublic: initialData?.isPublic ?? true,
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // After Supabase integration, we will add actual profile create/update logic here
      console.log("Profile form values:", values);
      
      toast({
        title: isEditing ? "Profile updated" : "Profile created",
        description: isEditing ? "Your profile has been updated successfully" : "Your profile has been created successfully",
      });
      
      // Simulate successful operation for now
      setTimeout(() => {
        setIsLoading(false);
        navigate(isEditing ? "/profile" : "/dashboard");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: isEditing ? "Failed to update profile" : "Failed to create profile",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Your Profile" : "Complete Your Profile"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update your profile information to help others find you and collaborate" 
            : "Let's set up your profile to help others find you and collaborate"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Stack Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself and your experience"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Limit: 500 characters. Briefly describe your experience, skills, and interests.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="University, Degree"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://yourwebsite.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/username"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills & Interests</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="skills"
                  render={() => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <div className="max-h-56 overflow-auto p-2 border rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          {SKILLS_OPTIONS.map((skill) => (
                            <FormField
                              key={skill}
                              control={form.control}
                              name="skills"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={skill}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), skill])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== skill
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {skill}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <FormDescription>
                        Select all skills that you have experience with.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <div className="max-h-56 overflow-auto p-2 border rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          {INTERESTS_OPTIONS.map((interest) => (
                            <FormField
                              key={interest}
                              control={form.control}
                              name="interests"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={interest}
                                    className="flex flex-row items-start space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(interest)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), interest])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== interest
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {interest}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <FormDescription>
                        Select areas or industries you're interested in working in.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="lookingFor"
              render={() => (
                <FormItem>
                  <FormLabel>Looking For</FormLabel>
                  <div className="max-h-56 overflow-auto p-2 border rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {LOOKING_FOR_OPTIONS.map((role) => (
                        <FormField
                          key={role}
                          control={form.control}
                          name="lookingFor"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={role}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), role])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== role
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {role}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <FormDescription>
                    Select the roles you're looking to collaborate with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How much time can you dedicate to projects?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Public Profile</FormLabel>
                    <FormDescription>
                      Allow your profile to be visible to other users and in search results.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-cobrew-600 hover:bg-cobrew-700"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isEditing ? "Updating..." : "Creating...")
                  : (isEditing ? "Update Profile" : "Create Profile")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
