
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Redirect from old Index to HomePage
const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
