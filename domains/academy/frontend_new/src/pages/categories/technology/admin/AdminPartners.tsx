import { useEffect, useState } from "react";
// import { supabase } from '@/integrations/supabase/client';
import AdminLayout from "@/components/categories/technology/admin/AdminLayout";
import { Button } from "@/components/categories/technology/ui/button";
import { Input } from "@/components/categories/technology/ui/input";
import { Label } from "@/components/categories/technology/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/technology/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/categories/technology/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/categories/technology/ui/dialog";
import { useToast } from "@/hooks/categories/technology/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
// import type { Tables } from '@/integrations/supabase/types';

type Partner = any;

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    type: "hiring",
    status: "active",
    sort_order: "0",
  });

  const fetchPartners = async () => {
    // TODO: Implement API fetching for partners
    setPartners([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      logo_url: "",
      website_url: "",
      type: "hiring",
      status: "active",
      sort_order: "0",
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({
      name: p.name,
      logo_url: p.logo_url || "",
      website_url: p.website_url || "",
      type: p.type,
      status: p.status,
      sort_order: String(p.sort_order),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    toast({ title: "Feature disabled (API pending)" });
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    toast({ title: "Feature disabled (API pending)" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Partners</h1>
          <Button
            onClick={openNew}
            className="bg-accent text-accent-foreground"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Partner
          </Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : partners.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No partners yet.
                  </TableCell>
                </TableRow>
              ) : (
                partners.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground">
                      {p.name}
                    </TableCell>
                    <TableCell className="capitalize">{p.type}</TableCell>
                    <TableCell className="capitalize">{p.status}</TableCell>
                    <TableCell>{p.sort_order}</TableCell>
                    <TableCell className="text-right flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Partner" : "New Partner"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={form.logo_url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, logo_url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Website URL</Label>
                <Input
                  value={form.website_url}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, website_url: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiring">Hiring</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, sort_order: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-accent text-accent-foreground"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{" "}
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPartners;
