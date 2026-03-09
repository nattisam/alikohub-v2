import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

const AdminEvents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<EventInsert>>({ type: "professional", status: "draft", privacy: "public" });

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, title, slug, description, type, status, privacy, start_datetime, end_datetime, location_name, location_address, location_map_url, host_name, cover_image_url, theme_template_id, timezone, created_by, created_at, updated_at").eq("created_by", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (event: EventInsert) => {
      const { error } = await supabase.from("events").insert(event);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event created!");
      setOpen(false);
      setForm({ type: "professional", status: "draft", privacy: "public" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.start_datetime || !form.end_datetime) {
      toast.error("Please fill required fields");
      return;
    }
    const slug = form.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createMutation.mutate({
      ...form,
      title: form.title!,
      slug: `${slug}-${Date.now().toString(36)}`,
      start_datetime: form.start_datetime!,
      end_datetime: form.end_datetime!,
      type: form.type as "professional" | "social",
      status: form.status as "draft" | "published" | "ended",
      privacy: form.privacy as "public" | "link_only" | "password",
      created_by: user!.id,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Events</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-body"><Plus className="w-4 h-4 mr-2" />Create Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">Create Event</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "professional" | "social" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "draft" | "published" | "ended" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="font-body">Title *</Label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label className="font-body">Description</Label>
                <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">Start Date/Time *</Label>
                  <Input type="datetime-local" value={form.start_datetime || ""} onChange={(e) => setForm({ ...form, start_datetime: e.target.value })} required />
                </div>
                <div>
                  <Label className="font-body">End Date/Time *</Label>
                  <Input type="datetime-local" value={form.end_datetime || ""} onChange={(e) => setForm({ ...form, end_datetime: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label className="font-body">Location Name</Label>
                <Input value={form.location_name || ""} onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
              </div>
              <div>
                <Label className="font-body">Location Address</Label>
                <Input value={form.location_address || ""} onChange={(e) => setForm({ ...form, location_address: e.target.value })} />
              </div>
              <div>
                <Label className="font-body">Host Name</Label>
                <Input value={form.host_name || ""} onChange={(e) => setForm({ ...form, host_name: e.target.value })} />
              </div>
              <Button type="submit" className="w-full font-body" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading events...</div>
      ) : !events?.length ? (
        <div className="text-center py-12 text-muted-foreground font-body">No events yet. Create your first event!</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-body font-semibold">Title</th>
                <th className="text-left p-3 font-body font-semibold hidden sm:table-cell">Type</th>
                <th className="text-left p-3 font-body font-semibold hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-body font-semibold hidden lg:table-cell">Date</th>
                <th className="text-right p-3 font-body font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-border">
                  <td className="p-3 font-body">{event.title}</td>
                  <td className="p-3 font-body hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${event.type === "professional" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {event.type}
                    </span>
                  </td>
                  <td className="p-3 font-body hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${event.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-3 font-body text-muted-foreground hidden lg:table-cell">
                    {new Date(event.start_datetime).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/${event.type}/events/${event.slug}`}>
                        <Button variant="ghost" size="sm"><Pencil className="w-3.5 h-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(event.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
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

export default AdminEvents;
