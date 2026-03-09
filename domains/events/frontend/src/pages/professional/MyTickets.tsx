import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Ticket, CalendarDays } from "lucide-react";
import { format } from "date-fns";

const MyTickets = () => {
  const { user } = useAuth();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("registrations")
        .select("*, events(title, slug, start_datetime, location_name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="professional" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">My Tickets</h1>
        <p className="text-muted-foreground font-body mb-8">Your event registrations and QR tickets</p>

        {!user ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body mb-4">Please sign in to view your tickets.</p>
            <Link to="/signin" className="text-primary font-body font-semibold hover:underline">Sign In</Link>
          </div>
        ) : isLoading ? (
          <p className="text-muted-foreground font-body">Loading tickets...</p>
        ) : !registrations?.length ? (
          <p className="text-muted-foreground font-body">No tickets yet. Browse and register for events!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((r: any) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">{r.events?.title}</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground font-body mb-4">
                  <p className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{r.events?.start_datetime ? format(new Date(r.events.start_datetime), "MMM d, yyyy") : ""}</p>
                  <p>{r.events?.location_name}</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground font-body mb-1">QR Code</p>
                  <p className="font-mono text-xs break-all">{r.qr_code_value}</p>
                </div>
                <div className="mt-3 flex justify-between text-xs font-body">
                  <span className={`px-2 py-0.5 rounded-full ${r.payment_status === "paid" ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-800"}`}>
                    {r.payment_status}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${r.checkin_status === "checked_in" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {r.checkin_status === "checked_in" ? "Checked In" : "Not Checked In"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer portal="professional" />
    </div>
  );
};

export default MyTickets;
