import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdminRSVPs = () => {
  const { user } = useAuth();

  const { data: rsvps, isLoading } = useQuery({
    queryKey: ["admin-rsvps"],
    queryFn: async () => {
      const { data: myEvents } = await supabase.from("events").select("id, title").eq("created_by", user!.id).eq("type", "social");
      if (!myEvents?.length) return [];
      const ids = myEvents.map((e) => e.id);
      const { data } = await supabase.from("rsvps").select("*").in("event_id", ids).order("created_at", { ascending: false });
      return (data ?? []).map((r) => ({ ...r, event_title: myEvents.find((e) => e.id === r.event_id)?.title ?? "" }));
    },
    enabled: !!user,
  });

  const yesCount = rsvps?.filter((r) => r.response === "yes").length ?? 0;
  const noCount = rsvps?.filter((r) => r.response === "no").length ?? 0;
  const maybeCount = rsvps?.filter((r) => r.response === "maybe").length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">RSVPs</h1>

      {!isLoading && rsvps && rsvps.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{yesCount}</p>
            <p className="text-xs text-green-600 font-body">Attending</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{noCount}</p>
            <p className="text-xs text-red-600 font-body">Declined</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{maybeCount}</p>
            <p className="text-xs text-yellow-600 font-body">Maybe</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : !rsvps?.length ? (
        <p className="text-muted-foreground font-body">No RSVPs yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-body font-semibold">Guest</th>
                <th className="text-left p-3 font-body font-semibold">Email</th>
                <th className="text-left p-3 font-body font-semibold hidden md:table-cell">Event</th>
                <th className="text-left p-3 font-body font-semibold">Response</th>
                <th className="text-left p-3 font-body font-semibold hidden lg:table-cell">Plus One</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-body">{r.guest_name}</td>
                  <td className="p-3 font-body text-muted-foreground">{r.guest_email}</td>
                  <td className="p-3 font-body hidden md:table-cell">{r.event_title}</td>
                  <td className="p-3 font-body">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      r.response === "yes" ? "bg-green-100 text-green-800" :
                      r.response === "no" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>{r.response}</span>
                  </td>
                  <td className="p-3 font-body hidden lg:table-cell text-muted-foreground">{r.plus_one_name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRSVPs;
