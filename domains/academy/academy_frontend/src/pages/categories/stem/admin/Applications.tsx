import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/categories/stem/admin/AdminLayout";
import { Button } from "@/components/categories/stem/ui/button";
import { Input } from "@/components/categories/stem/ui/input";
import { Textarea } from "@/components/categories/stem/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/categories/stem/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/categories/stem/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/categories/stem/ui/dialog";
import { Badge } from "@/components/categories/stem/ui/badge";
import { toast } from "sonner";
import { Search, Eye } from "lucide-react";
import { cn } from "@/lib/categories/stem/utils";

interface ApplicationRow {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  program_id: string;
  location: string | null;
  education_level: string | null;
  notes: string | null;
  programs?: { title: string; domain: string } | null;
}

const statuses = ["submitted", "review", "accepted", "waitlist", "rejected"];
const statusColors: Record<string, string> = {
  submitted: "bg-primary/15 text-primary border-primary/30",
  review: "bg-accent/15 text-accent border-accent/30",
  accepted: "bg-accent-green/15 text-accent-green border-accent-green/30",
  waitlist: "bg-accent/15 text-accent border-accent/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const AdminApplications = () => {
  // Mock data - replace with real data when backend is available
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ApplicationRow | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const updateStatus = async (id: string, newStatus: string) => {
    // Mock update - replace with real API call when backend is available
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    if (selected?.id === id) setSelected({ ...selected, status: newStatus });
    toast.success(`Status updated to ${newStatus}`);
  };

  const saveNotes = async () => {
    if (!selected) return;
    // Mock update - replace with real API call when backend is available
    setApps((prev) => prev.map((a) => (a.id === selected.id ? { ...a, admin_notes: adminNotes } : a)));
    toast.success("Notes saved");
  };

  const filtered = apps.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search && !a.full_name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Applications">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="font-bold">{filtered.length} applications</Badge>
      </div>

      <div className="border border-divider rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="font-bold">Applicant</TableHead>
                <TableHead className="font-bold">Program</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium">{a.full_name}</div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                  </TableCell>
                  <TableCell className="text-sm">{a.programs?.title || "â€”"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                      <SelectTrigger className="w-32 h-8">
                        <Badge variant="outline" className={cn("text-xs", statusColors[a.status])}>{a.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(a); setAdminNotes(a.admin_notes || ""); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selected.full_name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selected.email}</span></div>
                <div><span className="text-muted-foreground">Program:</span> <span className="font-medium">{selected.programs?.title}</span></div>
                <div><span className="text-muted-foreground">Location:</span> <span className="font-medium">{selected.location || "â€”"}</span></div>
                <div><span className="text-muted-foreground">Education:</span> <span className="font-medium">{selected.education_level || "â€”"}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={cn("text-xs", statusColors[selected.status])}>{selected.status}</Badge></div>
              </div>
              {selected.notes && (
                <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                  <p className="text-muted-foreground font-medium mb-1">Applicant Notes:</p>
                  <p className="whitespace-pre-wrap">{selected.notes}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold">Admin Notes</label>
                <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} />
                <Button size="sm" onClick={saveNotes}>Save Notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminApplications;
