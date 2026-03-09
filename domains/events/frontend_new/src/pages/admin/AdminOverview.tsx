import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Users, Ticket, Heart } from "lucide-react";

const AdminOverview = () => {
  const { user } = useAuth();

  const { data: events } = useQuery({
    queryKey: ["admin-events-count"],
    queryFn: async () => {
      const { count } = await supabase.from("events").select("*", { count: "exact", head: true }).eq("created_by", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["admin-registrations-count"],
    queryFn: async () => {
      const { data: myEvents } = await supabase.from("events").select("id").eq("created_by", user!.id);
      if (!myEvents?.length) return 0;
      const ids = myEvents.map((e) => e.id);
      const { count } = await supabase.from("registrations").select("*", { count: "exact", head: true }).in("event_id", ids);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: rsvps } = useQuery({
    queryKey: ["admin-rsvps-count"],
    queryFn: async () => {
      const { data: myEvents } = await supabase.from("events").select("id").eq("created_by", user!.id);
      if (!myEvents?.length) return 0;
      const ids = myEvents.map((e) => e.id);
      const { count } = await supabase.from("rsvps").select("*", { count: "exact", head: true }).in("event_id", ids);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const stats = [
    { label: "My Events", value: events ?? 0, icon: Calendar, color: "text-primary" },
    { label: "Registrations", value: registrations ?? 0, icon: Ticket, color: "text-accent" },
    { label: "RSVPs", value: rsvps ?? 0, icon: Heart, color: "text-destructive" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground font-body">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
