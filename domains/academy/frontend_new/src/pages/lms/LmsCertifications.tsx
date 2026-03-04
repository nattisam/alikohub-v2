import { Award, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";

const certificates = [
  {
    title: "CPR/BLS Certification",
    stream: "Health",
    streamClass: "stream-health",
    issuedDate: "January 15, 2026",
    credentialId: "CERT-HEALTH-2026-001",
  },
  {
    title: "Python Fundamentals",
    stream: "Tech",
    streamClass: "stream-tech",
    issuedDate: "December 10, 2025",
    credentialId: "CERT-TECH-2025-042",
  },
];

const LmsCertifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />

      <div className="section-container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Certifications</h1>
        <p className="text-muted-foreground mb-8">Your earned credentials and certificates.</p>

        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.credentialId} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cert.streamClass}`}>{cert.stream}</span>
                      <h3 className="font-heading font-semibold text-foreground mt-2">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Issued: {cert.issuedDate}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {cert.credentialId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Complete a course to earn your first certificate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LmsCertifications;
