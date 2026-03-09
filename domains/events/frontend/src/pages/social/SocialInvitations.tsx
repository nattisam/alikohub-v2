import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";

const SocialInvitations = () => {
  const { user } = useAuth();

  const { data: events, isLoading } = useQuery({
    queryKey: ["my-social-events", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, slug, description, type, status, privacy, start_datetime, end_datetime, location_name, location_address, location_map_url, host_name, cover_image_url, theme_template_id, timezone, created_by, created_at, updated_at")
        .eq("type", "social")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">My Invitations</h1>
        <p className="text-muted-foreground font-body mb-8">Events you've created</p>

        {!user ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body mb-4">Please sign in to view your invitations.</p>
            <Link to="/signin" className="text-accent font-body font-semibold hover:underline">Sign In</Link>
          </div>
        ) : isLoading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : !events?.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body mb-4">No events yet.</p>
            <Link to="/social/create" className="text-accent font-body font-semibold hover:underline">Create Your First Event</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.id} to={`/social/e/${event.slug}`}>
                <div className="bg-card border border-border rounded-xl p-6 shadow-card hover:shadow-elevated transition-all">
                  <h3 className="font-display font-semibold text-foreground mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground font-body">
                    <p className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-accent" />{format(new Date(event.start_datetime), "MMM d, yyyy")}</p>
                    {event.location_name && <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" />{event.location_name}</p>}
                  </div>
                  <span className={`inline-block mt-3 px-2 py-0.5 rounded-full text-xs ${event.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {event.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer portal="social" />
    </div>
  );
};

export default SocialInvitations;
