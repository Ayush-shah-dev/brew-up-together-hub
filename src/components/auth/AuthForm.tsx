
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup";

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthForm = ({ mode }: { mode: AuthMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize the form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // After Supabase integration, we will add actual login logic here
      console.log("Login values:", values);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Co-Brew!",
      });
      
      // Simulate successful login for now
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      // After Supabase integration, we will add actual signup logic here
      console.log("Signup values:", values);
      
      toast({
        title: "Account created",
        description: "Welcome to Co-Brew! Complete your profile to get started.",
      });
      
      // Simulate successful signup for now
      setTimeout(() => {
        setIsLoading(false);
        navigate("/profile/create");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Signup failed",
        description: "Error creating account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "login"
            ? "Enter your credentials to access your account"
            : "Join the Co-Brew community to start collaborating"}
        </p>
      </div>

      {mode === "login" ? (
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
            <FormField
              control={loginForm.control}
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
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-cobrew-600 hover:text-cobrew-800"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-cobrew-600 hover:bg-cobrew-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
            <FormField
              control={signupForm.control}
              name="name"
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
              control={signupForm.control}
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
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 6 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      )}

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <Link
            to={mode === "login" ? "/signup" : "/login"}
            className="ml-1 font-medium text-cobrew-600 hover:text-cobrew-800"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
