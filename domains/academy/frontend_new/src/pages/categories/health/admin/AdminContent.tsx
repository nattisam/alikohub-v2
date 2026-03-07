import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/categories/health/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import type { Tables } from "@/integrations/supabase/types"; // Removed

type ContentBlock = any; // Changed from Tables<"content_blocks">

export default function AdminContent() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ContentBlock | null>(null);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const fetchContent = async () => {
    // Renamed from fetch
    // TODO: Implement API fetching for site content
    setBlocks([]); // Changed from setContent to setBlocks
    setLoading(false);
  };

  useEffect(() => {
    fetchContent(); // Changed from fetch()
  }, []);

  const openCreate = () => {
    setEditing(null);
    setKey("");
    setValue("");
    setDialogOpen(true);
  };
  const openEdit = (b: ContentBlock) => {
    setEditing(b);
    setKey(b.key);
    setValue(b.value ?? "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    toast({ title: "Feature disabled (API pending)" });
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    toast({ title: "Feature disabled" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Content Blocks</h1>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : blocks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No content blocks yet
                  </TableCell>
                </TableRow>
              ) : (
                blocks.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {b.key}
                    </TableCell>
                    <TableCell className="max-w-md truncate text-sm">
                      {b.value || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(b.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(b)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(b.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Content Block" : "New Content Block"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Key *</Label>
                <Input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g. about.mission"
                  disabled={!!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={6}
                  placeholder="Content text…"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
