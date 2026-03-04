import { useState } from "react";
import { BellRing, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import { useToast } from "@/hooks/use-toast";

const notifOptions = [
  { key: "courseUpdates", label: "Course Updates", desc: "Get notified when courses you're enrolled in are updated" },
  { key: "newCourses", label: "New Courses", desc: "Notifications about new courses in your pathways" },
  { key: "webinars", label: "Webinar Reminders", desc: "Reminders before upcoming webinars" },
  { key: "promotions", label: "Promotions & Offers", desc: "Special offers and discount announcements" },
  { key: "achievements", label: "Achievements", desc: "Celebrate milestones and earned certificates" },
];

const LmsNotifications = () => {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifOptions.map((o) => [o.key, true]))
  );

  const toggle = (key: string) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Notification Preferences</h1>
        </div>

        <div className="bg-card rounded-xl border p-8 space-y-1">
          {notifOptions.map((opt) => (
            <div key={opt.key} className="flex items-center justify-between py-4 border-b last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              <button
                onClick={() => toggle(opt.key)}
                className={`w-11 h-6 rounded-full transition-colors relative ${prefs[opt.key] ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${prefs[opt.key] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
          <div className="pt-4">
            <Button className="gap-2" onClick={() => toast({ title: "Preferences saved!" })}>
              <Save className="w-4 h-4" /> Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LmsNotifications;
