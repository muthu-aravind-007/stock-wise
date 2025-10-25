import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center glass-card">
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-white">404</span>
        </div>
        <h1 className="text-4xl font-bold heading-gradient mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          The page you're looking for doesn't exist in StockWise.
        </p>
        <Button size="lg" className="gradient-primary hover-glow">
          <a href="/" className="flex items-center">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
