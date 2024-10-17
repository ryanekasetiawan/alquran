import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/quran", { replace: true });
      setIsRedirecting(false);
    }, 1);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isRedirecting) {
    return <div className="h-[100vh]" />;
  }

  return null;
};

export default Home;
