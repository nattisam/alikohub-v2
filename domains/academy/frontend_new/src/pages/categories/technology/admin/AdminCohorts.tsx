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
  DialogTrigger,
} from "@/components/categories/technology/ui/dialog";
import { useToast } from "@/hooks/categories/technology/use-toast";
import { Plus, Pencil, Loader2 } from "lucide-react";
// import type { Tables } from '@/integrations/supabase/types';
import { format } from "date-fns";

type Cohort = any;

const AdminCohorts = () => {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [programs, setPrograms] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    program_id: "",
    name: "",
    start_date: "",
    end_date: "",
    instructor_name: "",
    capacity: "30",
    status: "upcoming",
  });

  const fetchData = async () => {
    // TODO: Implement API fetching for cohorts
    setCohorts([]);
    setPrograms([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      program_id: "",
      name: "",
      start_date: "",
      end_date: "",
      instructor_name: "",
      capacity: "30",
      status: "upcoming",
    });
    setDialogOpen(true);
  };

  const openEdit = (cohort: any) => {
    setEditing(cohort);
    setForm({
      program_id: cohort.program_id,
      name: cohort.name,
      start_date: cohort.start_date,
      end_date: cohort.end_date || "",
      instructor_name: cohort.instructor_name || "",
      capacity: String(cohort.capacity),
      status: cohort.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    toast({ title: "Feature disabled (API pending)" });
    setDialogOpen(false);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "upcoming":
        return "bg-accent/20 text-accent";
      case "completed":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "bg-destructive/20 text-destructive";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Cohorts</h1>
          <Button
            onClick={openNew}
            className="bg-accent text-accent-foreground"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Cohort
          </Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : cohorts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No cohorts yet.
                  </TableCell>
                </TableRow>
              ) : (
                cohorts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-foreground">
                      {c.name}
                    </TableCell>
                    <TableCell>{c.program_title}</TableCell>
                    <TableCell>
                      {format(new Date(c.start_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{c.capacity}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="h-4 w-4" />
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
                {editing ? "Edit Cohort" : "New Cohort"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Program *</Label>
                <Select
                  value={form.program_id}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, program_id: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Cohort A - April 2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, start_date: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, end_date: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Input
                    value={form.instructor_name}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        instructor_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, capacity: e.target.value }))
                    }
                  />
                </div>
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
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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

export default AdminCohorts;
