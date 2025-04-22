
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import CreateProfilePage from "./pages/profile/CreateProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import ViewProfilePage from "./pages/profile/ViewProfilePage";
import DashboardPage from "./pages/profile/DashboardPage";
import ProjectsPage from "./pages/project/ProjectsPage";
import CreateProjectPage from "./pages/project/CreateProjectPage";
import ProjectSuccessPage from "./pages/project/ProjectSuccessPage";
import ProjectDetailPage from "./pages/project/ProjectDetailPage";
import ProjectApplicationPage from "./pages/project/ProjectApplicationPage";
import ApplicationsPage from "./pages/applications/ApplicationsPage";
import ApplicationDetailPage from "./pages/applications/ApplicationDetailPage";
import MessagesPage from "./pages/messaging/MessagesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Profile Routes */}
          <Route path="/profile/create" element={<CreateProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:userId" element={<ViewProfilePage />} />
          <Route path="/profile" element={<ViewProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Project Routes */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/success" element={<ProjectSuccessPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/projects/:projectId/apply" element={<ProjectApplicationPage />} />
          
          {/* Application Routes */}
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
          
          {/* Messaging Routes */}
          <Route path="/messages" element={<MessagesPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
