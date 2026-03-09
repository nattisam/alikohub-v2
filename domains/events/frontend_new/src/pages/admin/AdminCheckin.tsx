import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AdminCheckin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [search, setSearch] = useState("");

  const { data: events } = useQuery({
    queryKey: ["checkin-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title").eq("created_by", user!.id).eq("type", "professional");
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["checkin-registrations", selectedEvent],
    queryFn: async () => {
      const { data } = await supabase.from("registrations").select("*").eq("event_id", selectedEvent).order("attendee_name");
      return data ?? [];
    },
    enabled: !!selectedEvent,
  });

  const checkinMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("registrations").update({ checkin_status: "checked_in" as const }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkin-registrations"] });
      toast.success("Checked in!");
    },
  });

  const filtered = registrations?.filter((r) =>
    r.attendee_name.toLowerCase().includes(search.toLowerCase()) ||
    r.attendee_email.toLowerCase().includes(search.toLowerCase()) ||
    r.qr_code_value.includes(search)
  );

  const checkedIn = registrations?.filter((r) => r.checkin_status === "checked_in").length ?? 0;
  const total = registrations?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Check-in Tool</h1>

      <div className="mb-6">
        <Label className="font-body">Select Event</Label>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="max-w-md"><SelectValue placeholder="Choose event" /></SelectTrigger>
          <SelectContent>
            {events?.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or QR code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-body">
              <span className="text-primary font-bold">{checkedIn}</span> / {total} checked in
            </div>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground font-body">Loading...</p>
          ) : (
            <div className="space-y-2">
              {filtered?.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                  <div>
                    <p className="font-body font-semibold text-foreground">{r.attendee_name}</p>
                    <p className="text-xs text-muted-foreground font-body">{r.attendee_email}</p>
                  </div>
                  {r.checkin_status === "checked_in" ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-body">
                      <CheckCircle className="w-4 h-4" /> Checked In
                    </span>
                  ) : (
                    <Button size="sm" onClick={() => checkinMutation.mutate(r.id)} className="font-body">
                      Check In
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCheckin;
