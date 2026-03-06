import { useState, useEffect } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import { useUser } from "@/hooks/useAuth";
import { useAcademyProfile, useUpdateAcademyProfile } from "@/hooks/useAcademy";

const LmsProfile = () => {
  const { data: user } = useUser();
  const { data: profile, isLoading } = useAcademyProfile();
  const updateProfileMutation = useUpdateAcademyProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    bio: "",
    website: "",
    twitterX: "",
    linkedIn: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstname || "",
        lastName: user.lastname || "",
      }));
    }
    if (profile) {
      setForm((prev) => ({
        ...prev,
        headline: profile.headline || "",
        bio: profile.bio || "",
        website: profile.website || "",
        twitterX: profile.twitterX || "",
        linkedIn: profile.linkedIn || "",
      }));
    }
  }, [user, profile]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(form);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LmsNavbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-12 md:py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
            <User className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Manage your public profile and presence.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                First Name
              </label>
              <input
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={inputClass}
                disabled // Names are usually from auth
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Last Name
              </label>
              <input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={inputClass}
                disabled // Names are usually from auth
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Headline
            </label>
            <input
              value={form.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              className={inputClass}
              placeholder="e.g. Senior Software Engineer at TechCo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Biography
            </label>
            <textarea
              rows={5}
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Tell your story. What are you passionate about?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              Personal Website
            </label>
            <input
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className={inputClass}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Twitter / X
              </label>
              <input
                value={form.twitterX}
                onChange={(e) => handleChange("twitterX", e.target.value)}
                className={inputClass}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                LinkedIn
              </label>
              <input
                value={form.linkedIn}
                onChange={(e) => handleChange("linkedIn", e.target.value)}
                className={inputClass}
                placeholder="Profile URL or ID"
              />
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={updateProfileMutation.isPending}
              className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-accent hover:text-slate-900 transition-all font-bold px-10"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LmsProfile;
