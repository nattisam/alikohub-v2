import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth, EventsRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  type: string;
  status: string;
  eventDate?: string;
  location?: string;
  authorId: string;
}

const AdminEvents = () => {
  const { user, isAdmin, isContentManager, eventsProfile } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ type: "EVENT", content: "" });

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await api.get("/manage/events");
      return data; // This should be { items, total, ... }
    },
    enabled: !!user,
  });

  const events = postsData?.items || [];

  const createMutation = useMutation({
    mutationFn: async (event: any) => {
      const { data } = await api.post("/manage/events", event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event created as draft!");
      setOpen(false);
      setForm({ type: "EVENT", content: "" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/manage/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted");
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) => {
      await api.post(`/manage/events/${id}/review`, { status, rejectionReason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Review submitted");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/manage/events/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Submitted for review");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Title and Content are required");
      return;
    }
    createMutation.mutate(form);
  };

  const statusColor = (s: string) =>
    s === "PUBLISHED" ? "bg-emerald/15 text-emerald border border-emerald/20" :
    s === "PENDING" ? "bg-amber/15 text-amber border border-amber/20" :
    s === "REJECTED" ? "bg-rose/15 text-rose border border-rose/20" :
    "bg-secondary/15 text-secondary border border-secondary/20";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            {isAdmin() || isContentManager() ? "Event Administration" : "My Events"}
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {isAdmin() || isContentManager() ? "Review and manage all events" : "Manage your content"}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-body rounded-xl gap-2 shadow-md"><Plus className="w-4 h-4" />Create Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <DialogHeader><DialogTitle className="font-display">Create Event</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><Label className="font-body text-xs">Title *</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-xl" /></div>
              <div><Label className="font-body text-xs">Content *</Label><Textarea value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} required className="rounded-xl" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body text-xs">Event Date</Label><Input type="date" value={form.eventDate || ""} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="rounded-xl" /></div>
                <div><Label className="font-body text-xs">Location</Label><Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-xl" /></div>
              </div>
              <Button type="submit" className="w-full font-body rounded-xl" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Draft"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading events...</div>
      ) : !events.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-body">No entries found.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {events.map((event: Post, i: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border/60 rounded-2xl p-5 hover:shadow-card transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-display font-bold text-foreground text-base truncate">{event.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-body font-medium ${statusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                    {event.eventDate && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(event.eventDate).toLocaleDateString()}</span>}
                    {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  {event.status === "DRAFT" && event.authorId === user?.id && (
                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => submitMutation.mutate(event.id)}>Submit</Button>
                  )}
                  {isAdmin() && event.status === "PENDING" && (
                    <>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-success" onClick={() => reviewMutation.mutate({ id: event.id, status: "PUBLISHED" })}>
                        <CheckCircle className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => {
                        const reason = prompt("Rejection reason:");
                        if (reason) reviewMutation.mutate({ id: event.id, status: "REJECTED", rejectionReason: reason });
                      }}>
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-destructive" onClick={() => deleteMutation.mutate(event.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
