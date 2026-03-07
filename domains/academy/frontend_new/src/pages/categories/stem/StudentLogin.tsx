import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { ExternalLink, HelpCircle, BookOpen, Shield, Headphones } from "lucide-react";
import logoImg from "@/assets/categories/stem/aliko-stem-logo.png";

const StudentLogin = () => {
  return (
    <Layout>
      <section className="gradient-hero py-24 lg:py-32">
        <div className="container-content">
          <div className="max-w-2xl mx-auto text-center">
            <img src={logoImg} alt="Aliko Academy STEM" className="h-24 lg:h-32 w-auto mx-auto mb-8" />
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-foreground">
              Student <span className="text-primary">Login</span>
            </h1>
            <p className="mt-5 text-xl text-[hsl(210_30%_82%)] leading-relaxed">
              Access your courses and learning portal through our Learning Management System.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-content">
          <div className="max-w-lg mx-auto">
            <Card className="border-primary/25 bg-card shadow-2xl shadow-primary/10">
              <CardContent className="p-10 text-center">
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                    Ready to Learn?
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Click below to access the Aliko Academy LMS portal where you can view enrolled courses, track progress, and access materials.
                  </p>
                </div>

                <Button asChild size="xl" variant="hero" className="w-full mb-5">
                  <a href="https://lms.alikogroup.com" target="_blank" rel="noopener noreferrer">
                    Go to LMS Login
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>

                <div className="flex items-center justify-center gap-6 mt-5 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-accent-green" />
                    Secure Access
                  </span>
                  <span className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    Support Available
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <Link to="/contact">
                <Card className="border-divider bg-card hover:border-accent-green/40 hover:shadow-xl hover:shadow-accent-green/10 transition-all duration-300 h-full group card-hover">
                  <CardContent className="p-7 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent-green/15 border border-accent-green/30 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-6 w-6 text-accent-green" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent-green transition-colors">
                        Need Help?
                      </h3>
                      <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                        Having trouble? Contact our support team.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/programs">
                <Card className="border-divider bg-card hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 h-full group card-hover">
                  <CardContent className="p-7 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                        New Student?
                      </h3>
                      <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                        Browse programs and find the right course.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentLogin;
