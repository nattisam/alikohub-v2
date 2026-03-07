import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/categories/stem/admin/AdminLayout";
import { Input } from "@/components/categories/stem/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/categories/stem/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/categories/stem/ui/table";
import { Badge } from "@/components/categories/stem/ui/badge";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { cn } from "@/lib/categories/stem/utils";

interface InquiryRow {
  id: string;
  type: string;
  full_name: string;
  email: string;
  org_name: string | null;
  message: string;
  status: string;
  created_at: string;
}

const inquiryStatuses = ["new", "contacted", "qualified", "closed"];
const statusColors: Record<string, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  contacted: "bg-accent/15 text-accent border-accent/30",
  qualified: "bg-accent-green/15 text-accent-green border-accent-green/30",
  closed: "bg-muted text-muted-foreground border-divider",
};

const AdminInquiries = () => {
  // Mock data - replace with real data when backend is available
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const updateStatus = async (id: string, newStatus: string) => {
    // Mock update - replace with real API call when backend is available
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    toast.success(`Status updated to ${newStatus}`);
  };

  const filtered = inquiries.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (search && !i.full_name.toLowerCase().includes(search.toLowerCase()) && !i.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Inquiries">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {inquiryStatuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="font-bold">{filtered.length} inquiries</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="border border-divider rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="font-bold">Contact</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Organization</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="font-medium">{i.full_name}</div>
                    <div className="text-xs text-muted-foreground">{i.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{i.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.org_name || "â€”"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select value={i.status} onValueChange={(v) => updateStatus(i.id, v)}>
                      <SelectTrigger className="w-32 h-8">
                        <Badge variant="outline" className={cn("text-xs", statusColors[i.status])}>{i.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryStatuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
