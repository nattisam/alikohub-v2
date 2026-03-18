import { useEffect, useState } from "react";
// // import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/categories/health/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  CalendarDays,
  Users,
  FileText,
  Building2,
  BookOpen,
} from "lucide-react";

interface Stats {
  programs: number;
  cohorts: number;
  students: number;
  applications: number;
  enterpriseLeads: number;
  examPrep: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    programs: 0,
    cohorts: 0,
    students: 0,
    applications: 0,
    enterpriseLeads: 0,
    examPrep: 0,
  });

  useEffect(() => {
    // TODO: Implement API fetching for dashboard stats
    setStats({
      programs: 0,
      cohorts: 0,
      students: 0,
      applications: 0,
      enterpriseLeads: 0,
      examPrep: 0,
    });
  }, []);

  const cards = [
    {
      label: "Programs",
      value: stats.programs,
      icon: GraduationCap,
      color: "text-primary",
    },
    {
      label: "Cohorts",
      value: stats.cohorts,
      icon: CalendarDays,
      color: "text-teal",
    },
    {
      label: "Students",
      value: stats.students,
      icon: Users,
      color: "text-accent",
    },
    {
      label: "Applications",
      value: stats.applications,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Enterprise Leads",
      value: stats.enterpriseLeads,
      icon: Building2,
      color: "text-teal",
    },
    {
      label: "Exam Prep",
      value: stats.examPrep,
      icon: BookOpen,
      color: "text-accent",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
