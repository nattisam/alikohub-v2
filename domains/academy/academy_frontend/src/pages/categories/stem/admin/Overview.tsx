import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/categories/stem/admin/AdminLayout";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { BookOpen, FileText, MessageSquare, Users } from "lucide-react";

interface Stats {
  programs: number;
  applications: { total: number; new: number };
  inquiries: { total: number; new: number };
  users: number;
}

const Overview = () => {
  // Mock stats - replace with real data when backend is available
  const stats: Stats = {
    programs: 0,
    applications: { total: 0, new: 0 },
    inquiries: { total: 0, new: 0 },
    users: 0,
  };

  const cards = stats
    ? [
        { label: "Published Programs", value: stats.programs, icon: BookOpen, color: "text-primary", bg: "bg-primary/15" },
        { label: "Applications", value: stats.applications.total, sub: `${stats.applications.new} new`, icon: FileText, color: "text-accent-green", bg: "bg-accent-green/15" },
        { label: "Inquiries", value: stats.inquiries.total, sub: `${stats.inquiries.new} new`, icon: MessageSquare, color: "text-accent", bg: "bg-accent/15" },
        { label: "Users", value: stats.users, icon: Users, color: "text-primary", bg: "bg-primary/15" },
      ]
    : [];

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Card key={c.label} className="border-divider bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`h-6 w-6 ${c.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  {c.sub && <p className={`text-xs font-bold ${c.color}`}>{c.sub}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Overview;
