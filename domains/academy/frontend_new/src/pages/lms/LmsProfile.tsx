import { useState } from "react";
import { User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import { useToast } from "@/hooks/use-toast";

const LmsProfile = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: "Boni",
    lastName: "Birassa Aliko",
    headline: "Student at Aliko Academy",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const inputClass = "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Profile</h1>
        </div>

        <form onSubmit={handleSave} className="bg-card rounded-xl border p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">First Name</label>
              <input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Last Name</label>
              <input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Headline</label>
            <input value={form.headline} onChange={(e) => handleChange("headline", e.target.value)} className={inputClass} placeholder="e.g. Student, Developer, Nurse" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Biography</label>
            <textarea rows={4} value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} className={`${inputClass} resize-none`} placeholder="Tell us about yourself..." />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Website</label>
            <input value={form.website} onChange={(e) => handleChange("website", e.target.value)} className={inputClass} placeholder="https://" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Twitter / X</label>
              <input value={form.twitter} onChange={(e) => handleChange("twitter", e.target.value)} className={inputClass} placeholder="@username" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">LinkedIn</label>
              <input value={form.linkedin} onChange={(e) => handleChange("linkedin", e.target.value)} className={inputClass} placeholder="Profile URL" />
            </div>
          </div>
          <Button type="submit" className="gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default LmsProfile;
