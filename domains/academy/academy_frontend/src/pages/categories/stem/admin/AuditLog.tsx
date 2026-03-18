import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/categories/stem/admin/AdminLayout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/categories/stem/ui/table";
import { Badge } from "@/components/categories/stem/ui/badge";

interface AuditRow {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  actor_user_id: string | null;
  metadata: any;
  created_at: string;
}

const AdminAudit = () => {
  // Mock data - replace with real data when backend is available
  const [logs, setLogs] = useState<AuditRow[]>([]);

  return (
    <AdminLayout title="Audit Log">
      {logs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No audit logs yet.</div>
      ) : (
        <div className="border border-divider rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="font-bold">Timestamp</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                <TableHead className="font-bold">Entity</TableHead>
                <TableHead className="font-bold">Actor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{log.action}</Badge></TableCell>
                  <TableCell className="text-sm">
                    {log.entity_type}
                    {log.entity_id && <span className="text-muted-foreground ml-1 text-xs">({log.entity_id.slice(0, 8)}â€¦)</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.actor_user_id?.slice(0, 8) || "system"}â€¦</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAudit;
