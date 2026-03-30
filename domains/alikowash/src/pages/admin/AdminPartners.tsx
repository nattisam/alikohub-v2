import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const emptyPartner = {
  org_name: "", org_full_name: "", role: "", category: "donor",
  logo_url: "", website_url: "", display_order: 0, is_published: true,
};

export default function AdminPartners() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("partners").select("*").order("display_order");
    setItems(data || []);
  };
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    const payload = { ...editing };
    delete payload.created_at;
    delete payload.updated_at;
    if (editing.id) {
      const id = editing.id;
      delete payload.id;
      const { error } = await supabase.from("partners").update(payload).eq("id", id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      delete payload.id;
      const { error } = await supabase.from("partners").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!" });
    setIsOpen(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    await supabase.from("partners").delete().eq("id", id);
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Partners</h1>
        <Button onClick={() => { setEditing({ ...emptyPartner }); setIsOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-foreground">{p.org_name}</div>
                <div className="text-sm text-muted-foreground">{p.category} • {p.role}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...p }); setIsOpen(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No partners yet.</p>}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Partner</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Organization Name *</Label><Input value={editing.org_name} onChange={e => setEditing({ ...editing, org_name: e.target.value })} className="mt-1" /></div>
              <div><Label>Full Name</Label><Input value={editing.org_full_name || ""} onChange={e => setEditing({ ...editing, org_full_name: e.target.value })} className="mt-1" /></div>
              <div><Label>Role</Label><Input value={editing.role || ""} onChange={e => setEditing({ ...editing, role: e.target.value })} className="mt-1" /></div>
              <div>
                <Label>Category</Label>
                <select value={editing.category || "donor"} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="donor">Donor & Funding</option>
                  <option value="implementing">Implementing & Technical</option>
                  <option value="institutional">Institutional & Community</option>
                </select>
              </div>
              <div><Label>Logo URL</Label><Input value={editing.logo_url || ""} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} className="mt-1" /></div>
              <div><Label>Website URL</Label><Input value={editing.website_url || ""} onChange={e => setEditing({ ...editing, website_url: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Display Order</Label><Input type="number" value={editing.display_order} onChange={e => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} id="pub" />
                  <Label htmlFor="pub">Published</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">Save Partner</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
