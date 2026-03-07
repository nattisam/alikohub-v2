import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Badge } from "@/components/categories/stem/ui/badge";
import { FileText, ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/categories/stem/utils";

interface ApplicationRow {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  program_id: string;
  programs?: { title: string; slug: string; domain: string } | null;
}

const statusConfig: Record<string, { label: string; icon: React.ComponentType<{className?: string}>; color: string }> = {
  draft: { label: "Draft", icon: Clock, color: "bg-muted text-muted-foreground border-divider" },
  submitted: { label: "Submitted", icon: Clock, color: "bg-primary/15 text-primary border-primary/30" },
  review: { label: "Under Review", icon: AlertCircle, color: "bg-accent/15 text-accent border-accent/30" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "bg-accent-green/15 text-accent-green border-accent-green/30" },
  waitlist: { label: "Waitlisted", icon: Clock, color: "bg-accent/15 text-accent border-accent/30" },
  rejected: { label: "Not Selected", icon: XCircle, color: "bg-destructive/15 text-destructive border-destructive/30" },
};

const MyApplications = () => {
  // Mock data - replace with real data when backend is available
  const [applications, setApplications] = useState<ApplicationRow[]>([]);

  return (
    <Layout>
      <section className="gradient-hero py-16 lg:py-20">
        <div className="container-content">
          <div>
            <h1 className="font-display text-4xl font-extrabold text-foreground">
              My <span className="text-primary">Applications</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Track the status of your program applications.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-content">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                No Applications Yet
              </h2>
              <p className="text-muted-foreground mb-8">
                Browse our programs and submit your first application.
              </p>
              <Button asChild variant="hero" size="lg">
                <Link to="/programs">
                  Browse Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const status = statusConfig[app.status] || statusConfig.submitted;
                const StatusIcon = status.icon;
                return (
                  <Card key={app.id} className="border-divider bg-card">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-bold text-foreground">
                            {app.programs?.title || "Program"}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {app.programs?.domain} Â· Applied {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={cn("flex items-center gap-1.5 px-3 py-1.5 font-bold", status.color)}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MyApplications;
