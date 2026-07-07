import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseAnalytics } from "@/hooks/useAcademy";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CheckCircle, Clock, BarChart3 } from "lucide-react";

interface AnalyticsTabProps {
  courseId: string;
}

export const AnalyticsTab = ({ courseId }: AnalyticsTabProps) => {
  const { data: analytics, isLoading } = useCourseAnalytics(courseId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Progress Entries",
      value: analytics?.totalProgressEntries || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: analytics?.completed || 0,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "In Progress",
      value: analytics?.inProgress || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 lowercase first-letter:uppercase">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Course Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl m-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              Visual analytics coming soon
            </p>
            <p className="text-slate-400 text-sm">
              We are processing your data for detailed reports.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
