
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const ProjectSuccessPage = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Created!</h1>
          <p className="text-gray-600 mb-8">
            Your project has been successfully created and is now visible to potential collaborators.
          </p>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-cobrew-600 hover:bg-cobrew-700"
              asChild
            >
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link to="/projects">Browse Projects</Link>
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="font-medium text-blue-800 mb-2">What's next?</h2>
            <ul className="text-sm text-blue-700 text-left space-y-2">
              <li>• Share your project link with your network</li>
              <li>• Review applications from interested collaborators</li>
              <li>• Update your project details as it evolves</li>
              <li>• Connect with potential team members via the messaging system</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectSuccessPage;
