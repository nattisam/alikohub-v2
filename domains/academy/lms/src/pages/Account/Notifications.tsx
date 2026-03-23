import { useState } from "react";
import {
  BellRing,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import {
  useNotifications,
  useMarkNotificationRead,
  useDeleteNotification,
} from "@/hooks/useAcademy";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const { data: notifications, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const deleteMutation = useDeleteNotification();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications?.filter((n: any) => {
    if (activeTab === "unread") return !n.isRead;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <LmsNavbar />
      <div className="section-container max-w-3xl py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <BellRing className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Stay updated with your course activities.
              </p>
            </div>
          </div>

          <div className="flex bg-white rounded-xl p-1 border border-slate-200 self-start">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "all" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "unread" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))
          ) : filteredNotifications?.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                All caught up!
              </h3>
              <p className="text-sm text-slate-500">
                No new notifications for you right now.
              </p>
            </div>
          ) : (
            filteredNotifications?.map((notif: any) => (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all hover:shadow-md group ${notif.isRead ? "border-slate-100 opacity-80" : "border-accent/20 shadow-sm"}`}
              >
                <div
                  className={`mt-1 p-2 rounded-xl ${notif.isRead ? "bg-slate-50 text-slate-400" : "bg-accent/10 text-accent"}`}
                >
                  <BellRing className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p
                      className={`text-sm font-bold ${notif.isRead ? "text-slate-600" : "text-slate-900"}`}
                    >
                      {notif.title}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-3">
                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markReadMutation.mutate(notif.id)}
                        className="h-8 text-[10px] font-bold uppercase tracking-wider text-accent hover:bg-accent/5 gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark as read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(notif.id)}
                      className="h-8 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-50 hover:text-red-500 gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
