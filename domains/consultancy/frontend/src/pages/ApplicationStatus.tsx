import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

const ApplicationStatus = () => {
  const { code: urlCode } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!urlCode);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const requestRef = useRef(0);

  const handleSearch = async (searchCode: string) => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.get(
        `/consultancy/applications/status/${searchCode.trim()}`,
      );
      if (requestId === requestRef.current) {
        setResult(data);
      }
    } catch (err: any) {
      if (requestId === requestRef.current) {
        if (err.response?.status === 404) {
          setError("Application not found. Please check your code.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (urlCode) {
      handleSearch(urlCode);
    } else {
      // Automatically redirect home if no code is present in the path
      navigate("/");
    }
  }, [urlCode, navigate]);

  const statusConfig: Record<
    string,
    { icon: typeof CheckCircle2; label: string; color: string }
  > = {
    SUBMITTED: {
      icon: Clock,
      label: "Submitted - Under Initial Review",
      color: "text-blue-500",
    },
    UNDER_REVIEW: {
      icon: Clock,
      label: "Under Review",
      color: "text-yellow-500",
    },
    APPROVED: {
      icon: CheckCircle2,
      label: "Approved",
      color: "text-green-500",
    },
    REJECTED: {
      icon: AlertCircle,
      label: "Not Approved",
      color: "text-red-500",
    },
    WAITLISTED: { icon: Clock, label: "Waitlisted", color: "text-orange-500" },
    DRAFT: { icon: Clock, label: "Draft", color: "text-muted-foreground" },
  };

  // If no code is present, we don't render anything while redirecting
  if (!urlCode) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin mb-4" />
          <Loader2 className="w-8 h-8 text-gold absolute top-4 left-4 animate-pulse" />
        </div>
        <p className="text-navy font-serif text-lg font-medium animate-pulse">
          Checking Status...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* HEADER */}
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400 font-semibold">
              Application Status
            </p>
            <p className="text-xs text-navy font-mono font-bold tracking-widest opacity-60">
              REF: {result?.applicationCode || urlCode}
            </p>
          </div>

          {/* ERROR */}
          {error ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium">{error}</p>
              <div className="pt-2 flex flex-col gap-3">
                <Button
                  onClick={() => {
                    if (urlCode) handleSearch(urlCode);
                  }}
                  className="w-full rounded-xl bg-navy text-white hover:bg-gold hover:text-navy font-bold h-12"
                >
                  Try Again
                </Button>
                <Link to="/">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 text-xs uppercase font-black tracking-widest"
                  >
                    Back to Home Search
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            (() => {
              const cfg =
                statusConfig[result?.status] || statusConfig.SUBMITTED;
              const Icon = cfg.icon;

              return (
                <div className="space-y-6">
                  {/* STATUS ICON */}
                  <div className="w-20 h-20 mx-auto rounded-full bg-accent/5 flex items-center justify-center shadow-inner">
                    <Icon
                      className={`w-10 h-10 ${cfg.color} animate-in zoom-in duration-500`}
                    />
                  </div>

                  {/* STATUS TEXT */}
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 font-serif">
                      {cfg.label}
                    </h3>
                  </div>

                  {/* DETAILS */}
                  {result && (
                    <div className="grid grid-cols-2 bg-off-white rounded-2xl overflow-hidden border border-gray-100">
                      <div className="p-4 border-r border-gray-100 text-left">
                        <p className="text-[9px] uppercase font-black text-gray-400 mb-1">
                          Service
                        </p>
                        <p className="text-sm font-bold text-navy truncate capitalize">
                          {result.consultationType
                            ?.replace("_", " ")
                            .toLowerCase()}
                        </p>
                      </div>
                      <div className="p-4 text-left">
                        <p className="text-[9px] uppercase font-black text-gray-400 mb-1">
                          Updated
                        </p>
                        <p className="text-sm font-bold text-navy">
                          {new Date(result.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-3 pt-4">
                    <Link to="/book">
                      <Button className="w-full rounded-xl bg-gold text-navy hover:bg-navy hover:text-white font-bold h-14 shadow-lg">
                        Book Now
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button
                        variant="outline"
                        className="w-full h-14 rounded-xl border-2 font-bold hover:bg-off-white text-gray-500"
                      >
                        Get Help
                      </Button>
                    </Link>
                    <Link
                      to="/"
                      className="text-[10px] text-gray-400 hover:text-gold transition-colors pt-4 uppercase tracking-[0.2em] font-black underline-offset-8 hover:underline"
                    >
                      Track Another ID
                    </Link>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
