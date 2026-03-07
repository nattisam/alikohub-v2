import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/categories/health/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";
type Lead = any;

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  new: "default",
  contacted: "secondary",
  proposal_sent: "outline",
  won: "outline",
  lost: "destructive",
};

export default function AdminEnterpriseLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    // TODO: Implement API fetching for enterprise leads
    setLeads([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    toast({ title: "Feature disabled (API pending)" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Enterprise Leads</h1>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No leads yet
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">
                      {l.organization_name}
                    </TableCell>
                    <TableCell>{l.contact_name}</TableCell>
                    <TableCell>{l.email}</TableCell>
                    <TableCell>{l.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[l.status] ?? "default"}>
                        {l.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLead(l)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={l.status}
                        onValueChange={(v) => updateStatus(l.id, v)}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "new",
                            "contacted",
                            "proposal_sent",
                            "won",
                            "lost",
                          ].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Lead Detail Dialog */}
        <Dialog
          open={!!selectedLead}
          onOpenChange={() => setSelectedLead(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Lead Details — {selectedLead?.organization_name}
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Organization:
                    </span>
                    <p>{selectedLead.organization_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Contact:
                    </span>
                    <p>{selectedLead.contact_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Email:
                    </span>
                    <p>{selectedLead.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Phone:
                    </span>
                    <p>{selectedLead.phone || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Submitted:
                    </span>
                    <p>{new Date(selectedLead.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">
                      Status:
                    </span>
                    <Badge
                      variant={statusColors[selectedLead.status] ?? "default"}
                      className="mt-1"
                    >
                      {selectedLead.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
                {selectedLead.message && (
                  <div>
                    <span className="text-muted-foreground font-medium text-sm">
                      Message / Details:
                    </span>
                    <pre className="text-sm whitespace-pre-wrap bg-muted/50 rounded-lg p-3 border mt-1">
                      {selectedLead.message}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground font-medium text-sm">
                    Update Status:
                  </span>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(v) => {
                      updateStatus(selectedLead.id, v);
                      setSelectedLead({ ...selectedLead, status: v as any });
                    }}
                  >
                    <SelectTrigger className="w-48 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["new", "contacted", "proposal_sent", "won", "lost"].map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
