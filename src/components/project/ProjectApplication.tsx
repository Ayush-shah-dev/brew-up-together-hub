
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  message: z.string()
    .min(50, { message: "Message must be at least 50 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
  experience: z.string()
    .min(50, { message: "Experience must be at least 50 characters" })
    .max(1000, { message: "Experience must be less than 1000 characters" }),
  motivation: z.string()
    .min(50, { message: "Motivation must be at least 50 characters" })
    .max(1000, { message: "Motivation must be less than 1000 characters" }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ProjectApplicationProps {
  projectId: string;
  projectTitle: string;
}

const ProjectApplication = ({ projectId, projectTitle }: ProjectApplicationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      message: "",
      experience: "",
      motivation: "",
    },
  });

  const onSubmit = async (values: ApplicationFormValues) => {
    setIsLoading(true);
    try {
      // After Supabase integration, we will add actual application submission logic here
      console.log("Application values:", values);
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully. The project owner will review it soon.",
      });
      
      // Simulate successful operation for now
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/projects/${projectId}`);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Failed to submit application",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Apply to Join {projectTitle}</CardTitle>
        <CardDescription>
          Tell the project owner why you'd be a great addition to their team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Introduction Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduce yourself and explain why you're interested in this project..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Start with a friendly introduction and why this project caught your attention.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your relevant skills and experience..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Highlight skills and experiences that make you valuable for this specific project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation & Availability</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain your motivation for joining and your availability..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share why you're motivated to work on this project and how much time you can commit.
                  </FormDescription>
                  <FormMessage />
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
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectApplication;
