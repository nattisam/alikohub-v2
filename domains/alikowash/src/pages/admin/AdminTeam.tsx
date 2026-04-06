import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const empty = {
  name: "",
  role: "",
  bio: "",
  photo_url: "",
  display_order: 0,
  is_published: true,
};

export default function AdminTeam() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const data = await washService.getTeam();
      setItems(data || []);
    } catch (error) {
      console.error("Failed to fetch team", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await washService.upsertTeamMember(editing);
      toast.success("Saved!");
      setIsOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await washService.deleteTeamMember(id);
      toast.success("Deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete member");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Team Members
        </h1>
        <Button
          onClick={() => {
            setEditing({ ...empty });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>
      <div className="grid gap-4">
        {items.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-foreground">{m.name}</div>
                <div className="text-sm text-muted-foreground">{m.role}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing({ ...m });
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(m.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No team members yet.
          </p>
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit" : "New"} Team Member
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={editing.role || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, role: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={editing.bio || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, bio: e.target.value })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Photo URL</Label>
                <Input
                  value={editing.photo_url || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, photo_url: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={editing.is_published}
                    onChange={(e) =>
                      setEditing({ ...editing, is_published: e.target.checked })
                    }
                    id="pub"
                  />
                  <Label htmlFor="pub">Published</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
