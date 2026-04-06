import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const emptyPartner = {
  org_name: "",
  org_full_name: "",
  role: "",
  category: "donor",
  logo_url: "",
  website_url: "",
  display_order: 0,
  is_published: true,
};

export default function AdminPartners() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await washService.getPartners();
      setItems(data || []);
    } catch (error) {
      console.error("Failed to fetch partners", error);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async () => {
    try {
      await washService.upsertPartner(editing);
      toast.success("Saved!");
      setIsOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to save partner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    try {
      await washService.deletePartner(id);
      toast.success("Deleted!");
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete partner");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Partners
        </h1>
        <Button
          onClick={() => {
            setEditing({ ...emptyPartner });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-foreground">
                  {p.org_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {p.category} • {p.role}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing({ ...p });
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No partners yet.
          </p>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit" : "New"} Partner</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Organization Name *</Label>
                <Input
                  value={editing.org_name}
                  onChange={(e) =>
                    setEditing({ ...editing, org_name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Full Name</Label>
                <Input
                  value={editing.org_full_name || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, org_full_name: e.target.value })
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
                <Label>Category</Label>
                <select
                  value={editing.category || "donor"}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="donor">Donor & Funding</option>
                  <option value="implementing">Implementing & Technical</option>
                  <option value="institutional">
                    Institutional & Community
                  </option>
                </select>
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input
                  value={editing.logo_url || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, logo_url: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Website URL</Label>
                <Input
                  value={editing.website_url || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, website_url: e.target.value })
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
                Save Partner
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
