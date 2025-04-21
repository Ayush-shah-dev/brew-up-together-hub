
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Define the validation schema
const projectFormSchema = z.object({
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  summary: z.string()
    .min(10, { message: "Summary must be at least 10 characters" })
    .max(200, { message: "Summary must be less than 200 characters" }),
  description: z.string()
    .min(50, { message: "Description must be at least 50 characters" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
  stage: z.enum(["idea", "concept", "prototype", "mvp", "growth", "scaling"]),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  repo: z.string().url({ message: "Please enter a valid repository URL" }).optional().or(z.literal("")),
  requiredSkills: z.array(z.string()).min(1, { message: "Select at least one required skill" }),
  teamSize: z.enum(["solo", "small", "medium", "large"]),
  commitment: z.enum(["low", "medium", "high"]),
  compensation: z.enum(["none", "revenue-share", "equity", "paid"]),
  isRemote: z.boolean().default(true),
  isPublic: z.boolean().default(true),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Required skills options (these would typically come from a database)
const REQUIRED_SKILLS_OPTIONS = [
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

const ProjectForm = ({ 
  initialData,
  isEditing = false
}: { 
  initialData?: Partial<ProjectFormValues>,
  isEditing?: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize the form with default values or editing data
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      summary: initialData?.summary || "",
      description: initialData?.description || "",
      stage: initialData?.stage || "idea",
      website: initialData?.website || "",
      repo: initialData?.repo || "",
      requiredSkills: initialData?.requiredSkills || [],
      teamSize: initialData?.teamSize || "solo",
      commitment: initialData?.commitment || "medium",
      compensation: initialData?.compensation || "none",
      isRemote: initialData?.isRemote ?? true,
      isPublic: initialData?.isPublic ?? true,
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setIsLoading(true);
    try {
      // After Supabase integration, we will add actual project create/update logic here
      console.log("Project form values:", values);
      
      toast({
        title: isEditing ? "Project updated" : "Project created",
        description: isEditing ? "Your project has been updated successfully" : "Your project has been created successfully",
      });
      
      // Simulate successful operation for now
      setTimeout(() => {
        setIsLoading(false);
        navigate(isEditing ? "/dashboard" : "/projects/success");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: isEditing ? "Failed to update project" : "Failed to create project",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Project" : "Create New Project"}</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update your project details to attract the right collaborators" 
            : "Share your project idea to find the perfect collaborators"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., AI-Powered Meal Planning App" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your project a clear, concise name (5-100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of your project idea"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short summary of your project (10-200 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project in detail, including the problem it solves, target audience, key features, and your current progress."
                      className="resize-none min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed explanation of your project (50-2000 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Stage</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="idea">Idea Stage</SelectItem>
                        <SelectItem value="concept">Concept Development</SelectItem>
                        <SelectItem value="prototype">Prototype</SelectItem>
                        <SelectItem value="mvp">Minimum Viable Product</SelectItem>
                        <SelectItem value="growth">Growth Stage</SelectItem>
                        <SelectItem value="scaling">Scaling</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What stage is your project currently in?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Team Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solo">Solo (Just me)</SelectItem>
                        <SelectItem value="small">Small (2-3 people)</SelectItem>
                        <SelectItem value="medium">Medium (4-6 people)</SelectItem>
                        <SelectItem value="large">Large (7+ people)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How many people are currently on your team?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Website (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourproject.com"
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
                name="repo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiredSkills"
              render={() => (
                <FormItem>
                  <FormLabel>Required Skills</FormLabel>
                  <div className="max-h-56 overflow-auto p-2 border rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {REQUIRED_SKILLS_OPTIONS.map((skill) => (
                        <FormField
                          key={skill}
                          control={form.control}
                          name="requiredSkills"
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
                    Select the skills you're looking for in collaborators.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="commitment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Commitment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commitment level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low (1-5 hours/week)</SelectItem>
                        <SelectItem value="medium">Medium (5-15 hours/week)</SelectItem>
                        <SelectItem value="high">High (15+ hours/week)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How much time will collaborators need to commit?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compensation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compensation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select compensation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Volunteer/Portfolio)</SelectItem>
                        <SelectItem value="revenue-share">Revenue Sharing</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What type of compensation are you offering?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="isRemote"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Remote Collaboration</FormLabel>
                      <FormDescription>
                        This project can be worked on remotely.
                      </FormDescription>
                    </div>
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
                      <FormLabel>Public Project</FormLabel>
                      <FormDescription>
                        Make this project visible to all users. Uncheck for private projects that are invite-only.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

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
                  : (isEditing ? "Update Project" : "Create Project")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
