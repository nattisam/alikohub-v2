import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/categories/health/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
type Cohort = any;
type Program = any;

const emptyCohort: {
  name: string;
  program_id: string;
  start_date: string;
  end_date: string;
  location: string;
  time_range: string;
  days_of_week: string;
  status: "open_for_enrollment" | "waitlist" | "closed";
  max_seats: number | null;
  current_enrolled: number;
} = {
  name: "",
  program_id: "",
  start_date: "",
  end_date: "",
  location: "",
  time_range: "",
  days_of_week: "",
  status: "open_for_enrollment",
  max_seats: null,
  current_enrolled: 0,
};

export default function AdminCohorts() {
  const [cohorts, setCohorts] = useState<
    (Cohort & { programs: { name: string } | null })[]
  >([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Cohort | null>(null);
  const [form, setForm] = useState(emptyCohort);
  const { toast } = useToast();

  const fetch = async () => {
    // TODO: Implement API fetching for cohorts
    setCohorts([]);
    setPrograms([]);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCohort);
    setDialogOpen(true);
  };
  const openEdit = (c: Cohort) => {
    setEditing(c);
    setForm({
      name: c.name,
      program_id: c.program_id,
      start_date: c.start_date,
      end_date: c.end_date ?? "",
      location: c.location ?? "",
      time_range: c.time_range ?? "",
      days_of_week: c.days_of_week ?? "",
      status: c.status,
      max_seats: c.max_seats,
      current_enrolled: c.current_enrolled,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    toast({ title: "Feature disabled (API pending)" });
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    toast({ title: "Feature disabled" });
  };

  const statusColor = (s: string) => {
    if (s === "open_for_enrollment") return "default";
    if (s === "waitlist") return "secondary";
    return "destructive";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cohorts</h1>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Cohort
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : cohorts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No cohorts yet
                  </TableCell>
                </TableRow>
              ) : (
                cohorts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.programs?.name ?? "—"}</TableCell>
                    <TableCell>{c.start_date}</TableCell>
                    <TableCell className="text-sm">
                      {[c.days_of_week, c.time_range]
                        .filter(Boolean)
                        .join(" • ") || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColor(c.status)}>
                        {c.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.current_enrolled}
                      {c.max_seats ? `/${c.max_seats}` : ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(c)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id)}
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
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Cohort" : "New Cohort"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Program *</Label>
                  <Select
                    value={form.program_id}
                    onValueChange={(v) => setForm({ ...form, program_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm({ ...form, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm({ ...form, end_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <Input
                    value={form.days_of_week}
                    onChange={(e) =>
                      setForm({ ...form, days_of_week: e.target.value })
                    }
                    placeholder="Mon-Fri"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Input
                    value={form.time_range}
                    onChange={(e) =>
                      setForm({ ...form, time_range: e.target.value })
                    }
                    placeholder="9:00 AM - 3:00 PM"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open_for_enrollment">Open</SelectItem>
                      <SelectItem value="waitlist">Waitlist</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Seats</Label>
                  <Input
                    type="number"
                    value={form.max_seats ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        max_seats: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Enrolled</Label>
                  <Input
                    type="number"
                    value={form.current_enrolled}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        current_enrolled: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
