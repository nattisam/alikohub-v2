import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [form, setForm] = useState({ name: "", price: "0", quantity: "100" });

  const { data: events } = useQuery({
    queryKey: ["admin-pro-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title").eq("created_by", user!.id).eq("type", "professional");
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data: myEvents } = await supabase.from("events").select("id, title").eq("created_by", user!.id).eq("type", "professional");
      if (!myEvents?.length) return [];
      const ids = myEvents.map((e) => e.id);
      const { data } = await supabase.from("tickets").select("*").in("event_id", ids);
      return (data ?? []).map((t) => ({ ...t, event_title: myEvents.find((e) => e.id === t.event_id)?.title ?? "" }));
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("tickets").insert({
        event_id: selectedEvent,
        name: form.name,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Ticket tier created!");
      setOpen(false);
      setForm({ name: "", price: "0", quantity: "100" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tickets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Ticket deleted");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Tickets</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-body"><Plus className="w-4 h-4 mr-2" />Add Ticket Tier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">New Ticket Tier</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="font-body">Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>
                    {events?.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body">Tier Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Early Bird" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">Price ($)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label className="font-body">Quantity</Label>
                  <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </div>
              </div>
              <Button onClick={() => createMutation.mutate()} className="w-full font-body" disabled={!selectedEvent || !form.name}>
                Create Ticket Tier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : !tickets?.length ? (
        <p className="text-muted-foreground font-body">No ticket tiers yet. Create one for your professional events.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-body font-semibold">Event</th>
                <th className="text-left p-3 font-body font-semibold">Tier</th>
                <th className="text-left p-3 font-body font-semibold">Price</th>
                <th className="text-left p-3 font-body font-semibold">Qty</th>
                <th className="text-right p-3 font-body font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="p-3 font-body">{t.event_title}</td>
                  <td className="p-3 font-body">{t.name}</td>
                  <td className="p-3 font-body">${t.price}</td>
                  <td className="p-3 font-body">{t.quantity}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(t.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
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

export default AdminTickets;
