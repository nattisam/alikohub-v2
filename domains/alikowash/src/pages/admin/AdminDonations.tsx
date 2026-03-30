import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminDonations() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("donations").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Donations</h1>
      <div className="grid gap-3">
        {items.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-foreground">{d.donor_name}</div>
                <div className="text-sm text-muted-foreground">{d.email} • ${d.amount} {d.currency}</div>
                <div className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSelected(d)}><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No donations yet.</p>}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Donation Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><strong>Donor:</strong> {selected.donor_name}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Amount:</strong> ${selected.amount} {selected.currency}</div>
              {selected.country && <div><strong>Country:</strong> {selected.country}</div>}
              {selected.message && <div><strong>Message:</strong><p className="mt-1 p-3 bg-secondary rounded-lg">{selected.message}</p></div>}
              <div><strong>Status:</strong> {selected.status}</div>
              <div className="text-xs text-muted-foreground">Submitted: {new Date(selected.created_at).toLocaleString()}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
