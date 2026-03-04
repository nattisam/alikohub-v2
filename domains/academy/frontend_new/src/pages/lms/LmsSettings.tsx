import { useState } from "react";
import { Settings, Save, Globe, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import { useToast } from "@/hooks/use-toast";

const LmsSettings = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);

  const inputClass = "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1>
        </div>

        <div className="bg-card rounded-xl border p-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Language
            </label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputClass}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${darkMode ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-heading font-semibold text-foreground mb-2">Close Account</h3>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">Delete Account</Button>
          </div>

          <Button className="gap-2" onClick={() => toast({ title: "Settings saved!" })}>
            <Save className="w-4 h-4" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LmsSettings;
