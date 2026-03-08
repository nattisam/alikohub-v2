import { useEffect, useState } from "react";
// import { supabase } from '@/integrations/supabase/client';
import AdminLayout from "@/components/categories/technology/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/categories/technology/ui/table";
// import type { Tables } from '@/integrations/supabase/types';
import { format } from "date-fns";

type AuditLog = any;

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Implement API fetching for audit logs
    setLogs([]);
    setLoading(false);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No audit logs yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-foreground capitalize">
                      {log.action.replace("_", " ")}
                    </TableCell>
                    <TableCell className="capitalize">
                      {log.entity_type}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.entity_id?.slice(0, 8) || "—"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
