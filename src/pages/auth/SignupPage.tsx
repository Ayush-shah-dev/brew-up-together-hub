
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AuthForm from "@/components/auth/AuthForm";

const SignupPage = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Join Co-Brew</h1>
            <p className="mt-2 text-gray-600">
              Create an account to start building and collaborating on projects
            </p>
          </div>
          
          <AuthForm mode="signup" />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-cobrew-600 hover:text-cobrew-800"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
