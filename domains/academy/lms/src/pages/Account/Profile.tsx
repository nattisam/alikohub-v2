import { User, Loader2 } from "lucide-react";
import LmsNavbar from "@/components/LmsNavbar";
import { useUser } from "@/hooks/useAuth";

const Profile = () => {
  const { data: user, isLoading } = useUser();

  const infoItemClass =
    "bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-1";
  const labelClass =
    "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1";
  const valueClass = "text-lg font-bold text-slate-900";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LmsNavbar />
        <div className="flex items-center justify-center py-20 font-medium">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-12 md:py-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10 shadow-sm">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Your account information.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={infoItemClass}>
              <span className={labelClass}>First Name</span>
              <span className={valueClass}>{user?.firstname || "—"}</span>
            </div>
            <div className={infoItemClass}>
              <span className={labelClass}>Last Name</span>
              <span className={valueClass}>{user?.lastname || "—"}</span>
            </div>
          </div>

          <div className={infoItemClass}>
            <span className={labelClass}>Email Address</span>
            <span className={valueClass}>{user?.email || "—"}</span>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50">
            <p className="text-xs font-bold text-blue-600/70 uppercase tracking-widest text-center">
              Personal information is managed via your main account settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
