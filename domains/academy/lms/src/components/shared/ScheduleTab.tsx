import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCreateTeachingSchedule,
  useTeachingSchedules,
} from "@/hooks/useAcademy";
import {
  Calendar,
  Plus,
  Clock,
  Video,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ScheduleTabProps {
  courseId: string;
}

export const ScheduleTab = ({ courseId }: ScheduleTabProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "LIVE",
    startTime: "",
    endTime: "",
  });

  const { data: schedulesData, isLoading } = useTeachingSchedules();
  const createScheduleMutation = useCreateTeachingSchedule();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    createScheduleMutation.mutate(
      {
        courseId: Number(courseId),
        ...formData,
      },
      {
        onSuccess: () => {
          setIsAdding(false);
          setFormData({
            title: "",
            type: "LIVE",
            startTime: "",
            endTime: "",
          });
        },
      },
    );
  };

  const schedules = Array.isArray(schedulesData)
    ? schedulesData
    : (schedulesData as any)?.items || [];

  const filteredUpcoming =
    schedules?.filter(
      (s: any) => s.courseId?.toString() === courseId?.toString(),
    ) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 border-none">
            Teaching Schedule
          </h2>
          <p className="text-slate-500 text-sm">
            Create and manage your live sessions or office hours.
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-accent hover:bg-amber-light text-slate-900 font-bold gap-2"
        >
          {isAdding ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add Schedule
            </>
          )}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-none shadow-xl bg-slate-50 ring-1 ring-slate-100 overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 py-4 px-6 flex flex-row items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg font-bold">
              New Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-bold text-slate-700"
                >
                  Session Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Live Q&A Session"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-white border-slate-200 focus:ring-accent h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-sm font-bold text-slate-700"
                >
                  Session Type
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent h-11"
                >
                  <option value="LIVE">Live Session</option>
                  <option value="OFFICE_HOURS">Office Hours</option>
                  <option value="WORKSHOP">Workshop</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="startTime"
                  className="text-sm font-bold text-slate-700"
                >
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="bg-white border-slate-200 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="endTime"
                  className="text-sm font-bold text-slate-700"
                >
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="bg-white border-slate-200 h-11"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={createScheduleMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-8 rounded-lg transition-all shadow-md active:scale-95"
                >
                  {createScheduleMutation.isPending
                    ? "Scheduling..."
                    : "Create Schedule"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Scheduled Sessions
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredUpcoming.length === 0 ? (
          <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-12">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <Calendar className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-500 font-medium">
              No sessions scheduled yet.
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Add a schedule above to organize live meetings with your students.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUpcoming.map((session: any) => {
              let formattedDate = "Invalid date";
              let formattedTimeRange = "";
              try {
                if (session.startTime) {
                  const startDate = new Date(session.startTime);
                  formattedDate = format(startDate, "PPP");
                  formattedTimeRange = `${format(startDate, "p")}`;
                  if (session.endTime) {
                    formattedTimeRange += ` - ${format(new Date(session.endTime), "p")}`;
                  }
                }
              } catch (e) {
                console.error("Date formatting error", e);
              }

              return (
                <Card
                  key={session.id}
                  className="border-none shadow-sm h-full group hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                              session.type === "LIVE"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {session.type}
                          </span>
                          <h4 className="font-bold text-slate-800 line-clamp-1">
                            {session.title}
                          </h4>
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 rounded text-slate-400 group-hover:text-accent transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-accent" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-xs">
                            {formattedDate}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formattedTimeRange}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
