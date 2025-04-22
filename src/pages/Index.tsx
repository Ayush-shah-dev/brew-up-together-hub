
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Redirect from old Index to projects page
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/projects");
  }, [navigate]);

  return null;
};

export default Index;
