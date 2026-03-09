import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminAttendees = () => {
  const { user } = useAuth();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["admin-attendees"],
    queryFn: async () => {
      const { data: myEvents } = await supabase.from("events").select("id, title").eq("created_by", user!.id);
      if (!myEvents?.length) return [];
      const ids = myEvents.map((e) => e.id);
      const { data } = await supabase.from("registrations").select("*").in("event_id", ids).order("created_at", { ascending: false });
      return (data ?? []).map((r) => ({ ...r, event_title: myEvents.find((e) => e.id === r.event_id)?.title ?? "" }));
    },
    enabled: !!user,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Attendees</h1>
      {isLoading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : !registrations?.length ? (
        <p className="text-muted-foreground font-body">No registrations yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-body font-semibold">Name</th>
                <th className="text-left p-3 font-body font-semibold">Email</th>
                <th className="text-left p-3 font-body font-semibold hidden md:table-cell">Event</th>
                <th className="text-left p-3 font-body font-semibold hidden sm:table-cell">Payment</th>
                <th className="text-left p-3 font-body font-semibold">Check-in</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-body">{r.attendee_name}</td>
                  <td className="p-3 font-body text-muted-foreground">{r.attendee_email}</td>
                  <td className="p-3 font-body hidden md:table-cell">{r.event_title}</td>
                  <td className="p-3 font-body hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${r.payment_status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {r.payment_status}
                    </span>
                  </td>
                  <td className="p-3 font-body">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${r.checkin_status === "checked_in" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {r.checkin_status === "checked_in" ? "✓" : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAttendees;
