import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg mb-8">The page you're looking for doesn't exist.</p>
          <Button variant="default" asChild>
            <Link to="/"><Home className="w-5 h-5" /> Back to Home</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
