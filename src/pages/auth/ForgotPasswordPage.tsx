
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // After Supabase integration, this will call the actual password reset function
      console.log("Reset password for:", values.email);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            {!isSubmitted ? (
              <p className="mt-2 text-gray-600">
                Enter your email address and we'll send you a link to reset your password
              </p>
            ) : (
              <p className="mt-2 text-gray-600">
                If an account exists with that email, you'll receive a password reset link shortly
              </p>
            )}
          </div>

          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-cobrew-600 hover:bg-cobrew-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-4">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <Button 
                className="mt-2 bg-cobrew-600 hover:bg-cobrew-700"
                asChild
              >
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-cobrew-600 hover:text-cobrew-800"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
