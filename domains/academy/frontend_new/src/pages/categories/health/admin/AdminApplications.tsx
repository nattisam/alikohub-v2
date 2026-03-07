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
import { Eye, Download, FileText } from "lucide-react";
type Application = any;

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  new: "default",
  in_review: "secondary",
  accepted: "outline",
  enrolled: "outline",
  rejected: "destructive",
  withdrawn: "destructive",
};

export default function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const { toast } = useToast();

  const fetchApps = async () => {
    // TODO: Implement API fetching for applications
    setApps([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    toast({ title: "Feature disabled (API pending)" });
  };

  // Parse document paths from notes
  const getDocuments = (notes: string | null) => {
    if (!notes) return [];
    const docSection = notes.split("Documents:\n")[1];
    if (!docSection) return [];
    return docSection
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [type, path] = line.split(": ");
        return { type: type.replace(/([A-Z])/g, " $1").trim(), path };
      });
  };

  const downloadDocument = async (path: string, filename: string) => {
    toast({ title: "Feature disabled" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Applications</h1>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Change Status</TableHead>
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
              ) : apps.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No applications yet
                  </TableCell>
                </TableRow>
              ) : (
                apps.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.students
                        ? `${a.students.first_name} ${a.students.last_name}`
                        : "—"}
                      {a.students && (
                        <span className="block text-xs text-muted-foreground">
                          {a.students.email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{a.programs?.name ?? "—"}</TableCell>
                    <TableCell className="capitalize text-sm">
                      {a.source.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[a.status] ?? "default"}>
                        {a.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedApp(a)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={a.status}
                        onValueChange={(v) => updateStatus(a.id, v)}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "new",
                            "in_review",
                            "accepted",
                            "rejected",
                            "enrolled",
                            "withdrawn",
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

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    Student Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      {selectedApp.students
                        ? `${selectedApp.students.first_name} ${selectedApp.students.last_name}`
                        : "—"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {selectedApp.students?.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {selectedApp.students?.phone || "—"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">DOB:</span>{" "}
                      {selectedApp.students?.date_of_birth || "—"}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Address:</span>{" "}
                      {selectedApp.students?.address || "—"}
                    </div>
                  </div>
                </div>

                {/* Application Notes */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    Application Notes
                  </h3>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-lg p-3 border">
                    {selectedApp.notes?.split("Documents:")[0] ||
                      "No additional notes"}
                  </pre>
                </div>

                {/* Documents */}
                {getDocuments(selectedApp.notes).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">
                      Uploaded Documents
                    </h3>
                    <div className="space-y-2">
                      {getDocuments(selectedApp.notes).map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-muted/30 rounded-lg p-3 border"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium capitalize">
                              {doc.type}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              downloadDocument(
                                doc.path,
                                `${doc.type}.${doc.path.split(".").pop()}`,
                              )
                            }
                          >
                            <Download className="h-3 w-3 mr-1" /> Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">Status</h3>
                  <Select
                    value={selectedApp.status}
                    onValueChange={(v) => {
                      updateStatus(selectedApp.id, v);
                      setSelectedApp({ ...selectedApp, status: v as any });
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "new",
                        "in_review",
                        "accepted",
                        "rejected",
                        "enrolled",
                        "withdrawn",
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
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
