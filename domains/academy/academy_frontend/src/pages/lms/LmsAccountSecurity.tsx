import { useState } from "react";
import { Shield, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import { useToast } from "@/hooks/use-toast";

const LmsAccountSecurity = () => {
  const { toast } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.currentPassword) errs.currentPassword = "Current password is required";
    if (!form.newPassword) errs.newPassword = "New password is required";
    else if (form.newPassword.length < 8) errs.newPassword = "Must be at least 8 characters";
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    toast({ title: "Password updated", description: "Your password has been changed successfully." });
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const inputClass = "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Account Security</h1>
        </div>

        <form onSubmit={handleSave} className="bg-card rounded-xl border p-8 space-y-5">
          <h2 className="font-heading font-semibold text-foreground">Change Password</h2>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={form.currentPassword} onChange={(e) => handleChange("currentPassword", e.target.value)} className={inputClass} />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="text-xs text-destructive mt-1">{errors.currentPassword}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={form.newPassword} onChange={(e) => handleChange("newPassword", e.target.value)} className={inputClass} />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} className={inputClass} />
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
          </div>
          <Button type="submit" className="gap-2"><Save className="w-4 h-4" /> Update Password</Button>
        </form>

        <div className="bg-card rounded-xl border p-8 mt-6">
          <h2 className="font-heading font-semibold text-foreground mb-4">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </div>
    </div>
  );
};

export default LmsAccountSecurity;
