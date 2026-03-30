import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const empty = { year: "", project_name: "", story_text: "", tags: "", order_index: 0, is_published: true };

export default function AdminStories() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("story_chapters").select("*").order("order_index");
    setItems(data || []);
  };
  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    const payload = {
      year: editing.year,
      project_name: editing.project_name,
      story_text: editing.story_text || null,
      tags: editing.tags ? editing.tags.split(",").map((t: string) => t.trim()) : null,
      order_index: editing.order_index || 0,
      is_published: editing.is_published,
    };
    if (editing.id) {
      const { error } = await supabase.from("story_chapters").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("story_chapters").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!" }); setIsOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("story_chapters").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Story Chapters</h1>
        <Button onClick={() => { setEditing({ ...empty }); setIsOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add Chapter</Button>
      </div>
      <div className="grid gap-4">
        {items.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-foreground">{s.year} — {s.project_name}</div>
                <div className="text-sm text-muted-foreground truncate max-w-md">{s.story_text?.slice(0, 80)}...</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...s, tags: s.tags?.join(", ") || "" }); setIsOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No story chapters yet.</p>}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Story Chapter</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Year *</Label><Input value={editing.year} onChange={e => setEditing({ ...editing, year: e.target.value })} className="mt-1" /></div>
                <div><Label>Order Index</Label><Input type="number" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              </div>
              <div><Label>Project Name *</Label><Input value={editing.project_name} onChange={e => setEditing({ ...editing, project_name: e.target.value })} className="mt-1" /></div>
              <div><Label>Story Text</Label><Textarea value={editing.story_text || ""} onChange={e => setEditing({ ...editing, story_text: e.target.value })} className="mt-1" rows={5} /></div>
              <div><Label>Tags (comma-separated)</Label><Input value={editing.tags} onChange={e => setEditing({ ...editing, tags: e.target.value })} className="mt-1" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} id="pub" />
                <Label htmlFor="pub">Published</Label>
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
