import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CalendarDays, MapPin, Filter, Wifi, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";

const BrowseEvents = () => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [locationFilter, setLocationFilter] = useState<"all" | "in-person" | "virtual">("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ["professional-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, slug, description, type, status, privacy, start_datetime, end_datetime, location_name, location_address, location_map_url, host_name, cover_image_url, theme_template_id, timezone, created_by, created_at, updated_at")
        .eq("type", "professional")
        .eq("status", "published")
        .order("start_datetime", { ascending: true });
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter((e) => {
        // Search
        const q = search.toLowerCase();
        if (q && !e.title.toLowerCase().includes(q) && !e.location_name?.toLowerCase().includes(q) && !e.description?.toLowerCase().includes(q)) return false;
        // Date
        if (dateFilter === "upcoming" && new Date(e.start_datetime) < now) return false;
        if (dateFilter === "past" && new Date(e.start_datetime) >= now) return false;
        // Location
        if (locationFilter === "in-person" && !e.location_name) return false;
        if (locationFilter === "virtual" && e.location_name) return false;
        return true;
      })
      .slice(0, 6);
  }, [events, search, dateFilter, locationFilter]);

  const activeFilterClasses = "bg-primary text-primary-foreground";
  const inactiveFilterClasses = "bg-card text-muted-foreground border border-border hover:bg-muted";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar portal="professional" />
      <div className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">Browse Events</h1>
        <p className="text-muted-foreground font-body mb-8">Discover professional events, conferences, and more</p>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title, location, or description..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-1.5 mr-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-body text-muted-foreground font-medium">Filters:</span>
          </div>

          {/* Date filter */}
          <div className="flex gap-1.5">
            {(["upcoming", "past", "all"] as const).map((val) => (
              <Button
                key={val}
                size="sm"
                variant="ghost"
                onClick={() => setDateFilter(val)}
                className={`text-xs font-body rounded-full px-3 h-8 ${dateFilter === val ? activeFilterClasses : inactiveFilterClasses}`}
              >
                <CalendarDays className="w-3 h-3 mr-1" />
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </Button>
            ))}
          </div>

          <div className="w-px h-8 bg-border" />

          {/* Location filter */}
          <div className="flex gap-1.5">
            {([
              { val: "all" as const, icon: null, label: "All" },
              { val: "in-person" as const, icon: Building2, label: "In Person" },
              { val: "virtual" as const, icon: Wifi, label: "Virtual" },
            ]).map(({ val, icon: Icon, label }) => (
              <Button
                key={val}
                size="sm"
                variant="ghost"
                onClick={() => setLocationFilter(val)}
                className={`text-xs font-body rounded-full px-3 h-8 ${locationFilter === val ? activeFilterClasses : inactiveFilterClasses}`}
              >
                {Icon && <Icon className="w-3 h-3 mr-1" />}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground font-body">Loading events...</p>
        ) : !filtered.length ? (
          <p className="text-muted-foreground font-body">No events found matching your filters.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground font-body mb-4">Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <Link key={event.id} to={`/professional/events/${event.slug}`} className="group">
                  <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/20">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      {event.cover_image_url ? (
                        <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <CalendarDays className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                      )}
                      {!event.location_name && (
                        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold font-body rounded-full bg-primary text-primary-foreground">
                          Virtual
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{event.description}</p>
                      )}
                      <div className="space-y-1.5 font-body text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span>{format(new Date(event.start_datetime), "MMM d, yyyy · h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span>{event.location_name ?? "Virtual Event"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer portal="professional" />
    </div>
  );
};

export default BrowseEvents;
