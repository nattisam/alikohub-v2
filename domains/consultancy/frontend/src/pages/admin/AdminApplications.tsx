import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Download } from "lucide-react";

type Application = {
  id: string;
  applicationCode: string;
  fullName: string;
  email: string;
  phone: string | null;
  consultationType: string;
  status: string;
  adminNotes: string | null;
  formData: any;
  createdAt: string;
  updatedAt: string;
  documents?: any[];
  logs?: any[];
};

const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/consultancy/applications");
      setApplications(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to fetch applications.", variant: "destructive" });
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const openDetail = async (app: Application) => {
    try {
      const { data } = await api.get(`/consultancy/applications/${app.id}`);
      setSelected(data);
      setAdminNotes(data.adminNotes || "");
      setNewStatus(data.status);
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to fetch application details.", variant: "destructive" });
    }
  };

  const updateApplication = async () => {
    if (!selected) return;
    try {
      const isStatusChanged = newStatus !== selected.status;
      
      if (isStatusChanged) {
        await api.patch(`/consultancy/applications/${selected.id}/status`, {
          status: newStatus,
          notes: "Updated by admin"
        });
      }

      await api.patch(`/consultancy/applications/${selected.id}`, {
        adminNotes: adminNotes,
      });

      toast({ title: "Application Updated" });
      setSelected(null);
      fetchApplications();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update.", variant: "destructive" });
    }
  };

  const filtered = applications.filter((a) => {
    const matchesSearch = 
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationCode.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || a.status === statusFilter.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary mb-1">Applications</h1>
        <p className="text-muted-foreground text-sm">Review and manage applications.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="waitlisted">Waitlisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-muted/20">
                  <td className="p-3 font-mono text-xs">{a.applicationCode}</td>
                  <td className="p-3">{a.fullName}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3 capitalize">{a.consultationType}</td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      a.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      a.status === "SUBMITTED" ? "bg-blue-100 text-blue-700" :
                      a.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-700" :
                      a.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-muted text-muted-foreground"
                    }`}>{a.status}</span>
                  </td>
                  <td className="p-3 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openDetail(a)}><Eye className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Application Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Code:</span> <span className="font-mono">{selected.applicationCode}</span></div>
                <div><span className="text-muted-foreground">Name:</span> {selected.fullName}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selected.phone || "N/A"}</div>
                <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{selected.consultationType}</span></div>
                <div><span className="text-muted-foreground">Submitted:</span> {new Date(selected.createdAt).toLocaleDateString()}</div>
              </div>

              {selected.formData && Object.keys(selected.formData as object).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Form Data</h3>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                    {Object.entries(selected.formData as Record<string, string>).map(([key, value]) => (
                      <div key={key}><span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span> {value}</div>
                    ))}
                  </div>
                </div>
              )}

              {selected.documents && selected.documents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Documents ({selected.documents.length})</h3>
                  <div className="space-y-2">
                    {selected.documents.map((d) => (
                      <div key={d.id} className="flex items-center justify-between bg-muted/30 rounded-lg p-2 text-sm">
                        <span>{d.fileName}</span>
                        <a href={d.filePath} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.logs && selected.logs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Status History</h3>
                  <div className="space-y-2">
                    {selected.logs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                        <span>{log.oldStatus || "new"} &rarr; {log.newStatus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue placeholder="Update status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Admin notes..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
              <Button onClick={updateApplication} className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
