import React, { useState } from "react";
import { useAnnouncements, useCreateAnnouncement } from "@/hooks/useAcademy";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Megaphone,
  Plus,
  Send,
  Loader2,
  Clock,
  CalendarDays,
  Inbox,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export function AdminAnnouncements() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAnnouncements({ page, pageSize });
  const createMutation = useCreateAnnouncement();

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const announcements = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    await createMutation.mutateAsync({
      title: newTitle.trim(),
      content: newContent.trim(),
    });
    setNewTitle("");
    setNewContent("");
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      {/* Title section + publish toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Broadcast Announcements
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Publish site-wide announcements and send push notifications to app
            users.
          </p>
        </div>

        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="gap-2 bg-[#005461] hover:bg-[#00434d] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
        >
          {showCreate ? "View Announcements" : "Create Announcement"}
          {!showCreate && <Plus size={14} />}
        </Button>
      </div>

      {showCreate ? (
        /* Inline Creator Panel */
        <div className="bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-[#3f3f46] rounded-xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Draft New Announcement
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance, New Course Release..."
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-[#3f3f46] bg-transparent text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#3BC1A8]/40 focus:border-[#3BC1A8] transition-all"
                disabled={createMutation.isPending}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
                Content Body
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Type the announcement message details here..."
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-[#3f3f46] bg-transparent text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#3BC1A8]/40 focus:border-[#3BC1A8] transition-all resize-none"
                disabled={createMutation.isPending}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-[#3f3f46]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowCreate(false);
                  setNewTitle("");
                  setNewContent("");
                }}
                disabled={createMutation.isPending}
                className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !newTitle.trim() ||
                  !newContent.trim() ||
                  createMutation.isPending
                }
                className="bg-[#005461] hover:bg-[#00434d] text-white text-xs font-bold flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Publish
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* History & List Panel */
        <div className="bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-[#3f3f46] rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="px-6 py-5 border-b border-zinc-200 dark:border-[#3f3f46] flex items-center justify-between transition-colors duration-300">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
              Announcement Registry ({total})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 text-xs font-semibold gap-1.5 border-zinc-200 dark:border-[#3f3f46] dark:text-zinc-300"
            >
              <RefreshCw
                className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
              />
              Sync
            </Button>
          </div>

          {isLoading ? (
            /* Loading skeletons matching dashboard grids */
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-3 w-5/6 rounded" />
                    <Skeleton className="h-3 w-2/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Error Card */
            <div className="p-12 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Failed to load announcements
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                {(error as any)?.response?.data?.message ||
                  (error as any)?.message ||
                  "An error occurred helper payload."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-3 gap-1.5 text-xs font-semibold"
              >
                Retry
              </Button>
            </div>
          ) : announcements.length === 0 ? (
            /* Empty State */
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                No announcements broadcasted yet
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                Start sharing updates, cohort releases, scheduling revisions,
                etc. with learners.
              </p>
              <Button
                onClick={() => setShowCreate(true)}
                className="mt-4 gap-1 bg-[#005461] hover:bg-[#00434d] text-white text-xs font-bold rounded-xl"
              >
                Create Announcement
              </Button>
            </div>
          ) : (
            /* Table Log */
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-bold border-b border-zinc-200 dark:border-[#3f3f46] transition-colors duration-300">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Message Summary</th>
                    <th className="px-6 py-4">Timeline</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-[#3f3f46]">
                  {announcements.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-[#3f3f46]/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-zinc-900 dark:text-white text-sm max-w-[200px] truncate">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-md leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 font-bold text-zinc-700 dark:text-zinc-300">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <span className="flex items-center gap-1 text-[10px]">
                            <CalendarDays className="w-3 h-3 text-zinc-400" />
                            {format(new Date(item.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          SENT / ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-[#3f3f46]">
                  <span className="text-xs text-zinc-500 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#3f3f46] dark:hover:bg-[#52525b] border border-zinc-200 dark:border-[#52525b] text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isFetching}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#3f3f46] dark:hover:bg-[#52525b] border border-zinc-200 dark:border-[#52525b] text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages || isFetching}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
