import { useEffect, useState } from "react";
// import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/categories/technology/ui/card";
import {
  GraduationCap,
  ClipboardList,
  Users,
  HeadphonesIcon,
  Star,
} from "lucide-react";
import AdminLayout from "@/components/categories/technology/admin/AdminLayout";

interface Stats {
  totalPrograms: number;
  publishedPrograms: number;
  applicationsThisMonth: number;
  activeCohorts: number;
  openTickets: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPrograms: 0,
    publishedPrograms: 0,
    applicationsThisMonth: 0,
    activeCohorts: 0,
    openTickets: 0,
  });

  useEffect(() => {
    // TODO: Implement API fetching for dashboard stats
    setStats({
      totalPrograms: 12,
      publishedPrograms: 8,
      applicationsThisMonth: 45,
      activeCohorts: 6,
      openTickets: 3,
    });
  }, []);

  const cards = [
    {
      label: "Total Programs",
      value: stats.totalPrograms,
      icon: GraduationCap,
      color: "text-accent",
    },
    {
      label: "Published",
      value: stats.publishedPrograms,
      icon: Star,
      color: "text-secondary",
    },
    {
      label: "Applications (Month)",
      value: stats.applicationsThisMonth,
      icon: ClipboardList,
      color: "text-accent",
    },
    {
      label: "Active Cohorts",
      value: stats.activeCohorts,
      icon: Users,
      color: "text-secondary",
    },
    {
      label: "Open Tickets",
      value: stats.openTickets,
      icon: HeadphonesIcon,
      color: "text-destructive",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <Card key={card.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
