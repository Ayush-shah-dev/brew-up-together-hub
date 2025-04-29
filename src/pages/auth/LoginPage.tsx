
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AuthForm from "@/components/auth/AuthForm";
import { checkAuth } from "@/lib/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Get the returnTo parameter from the URL if it exists
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const user = await checkAuth();
        if (user) {
          // If user is already authenticated, redirect to the return URL or dashboard
          navigate(returnTo);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, [navigate, returnTo]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cobrew-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Log in to your Co-Brew account to continue building amazing projects
            </p>
          </div>
          
          <AuthForm mode="login" returnTo={returnTo} />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              New to Co-Brew?{" "}
              <Link
                to={`/signup${returnTo !== '/dashboard' ? `?returnTo=${returnTo}` : ''}`}
                className="font-medium text-cobrew-600 hover:text-cobrew-800"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
