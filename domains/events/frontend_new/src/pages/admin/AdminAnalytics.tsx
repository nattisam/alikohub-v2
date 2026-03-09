import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminAnalytics = () => {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data: events } = await supabase.from("events").select("id, type, title").eq("created_by", user!.id);
      if (!events?.length) return { proEvents: 0, socialEvents: 0, totalReg: 0, totalRsvp: 0, revenue: 0, checkedIn: 0 };

      const proIds = events.filter((e) => e.type === "professional").map((e) => e.id);
      const socialIds = events.filter((e) => e.type === "social").map((e) => e.id);

      let totalReg = 0, revenue = 0, checkedIn = 0, totalRsvp = 0;

      if (proIds.length) {
        const { data: regs } = await supabase.from("registrations").select("total_paid, checkin_status").in("event_id", proIds);
        totalReg = regs?.length ?? 0;
        revenue = regs?.reduce((sum, r) => sum + (r.total_paid || 0), 0) ?? 0;
        checkedIn = regs?.filter((r) => r.checkin_status === "checked_in").length ?? 0;
      }

      if (socialIds.length) {
        const { count } = await supabase.from("rsvps").select("*", { count: "exact", head: true }).in("event_id", socialIds);
        totalRsvp = count ?? 0;
      }

      return { proEvents: proIds.length, socialEvents: socialIds.length, totalReg, totalRsvp, revenue, checkedIn };
    },
    enabled: !!user,
  });

  const stats = [
    { label: "Professional Events", value: data?.proEvents ?? 0 },
    { label: "Social Events", value: data?.socialEvents ?? 0 },
    { label: "Total Registrations", value: data?.totalReg ?? 0 },
    { label: "Total RSVPs", value: data?.totalRsvp ?? 0 },
    { label: "Revenue", value: `$${(data?.revenue ?? 0).toFixed(2)}` },
    { label: "Checked In", value: data?.checkedIn ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Analytics</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-6 shadow-card">
            <p className="text-sm text-muted-foreground font-body mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
