import { Layout } from "@/components/categories/health/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck } from "lucide-react";
import logo from "@/assets/categories/health/logo-new.png";

const StudentLogin = () => {
  return (
    <Layout>
      {/* Gradient Header */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/90 to-teal overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-teal rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container-academy relative z-10">
          <div className="max-w-md mx-auto">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  <img
                    src={logo}
                    alt="Aliko Academy Health"
                    className="h-20 w-auto mx-auto"
                  />
                </div>
                <CardTitle className="text-2xl text-foreground">
                  Student Portal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center">
                  Access your course materials, assignments, and progress
                  through our Learning Management System (LMS).
                </p>

                <div className="flex items-center gap-2 justify-center text-xs text-teal">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-medium">
                    Secure, encrypted connection
                  </span>
                </div>

                <Button asChild size="lg" className="w-full">
                  <a
                    href="https://academy.alikohub.com/category/Health"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to Student Portal
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2 text-center">
                    Need help logging in?
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Contact Student Services at{" "}
                    <a
                      href="tel:2065550100"
                      className="text-primary hover:underline"
                    >
                      (206) 555-0100
                    </a>{" "}
                    or{" "}
                    <a
                      href="mailto:support@alikoacademy.edu"
                      className="text-primary hover:underline"
                    >
                      support@alikoacademy.edu
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentLogin;
