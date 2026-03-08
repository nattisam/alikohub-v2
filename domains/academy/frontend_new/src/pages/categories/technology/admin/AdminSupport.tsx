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
import { Button } from "@/components/categories/technology/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/technology/ui/select";
// import type { Tables } from '@/integrations/supabase/types';
import { format } from "date-fns";

type Ticket = any;

const AdminSupport = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchTickets = async () => {
    // TODO: Implement API fetching for tickets
    setTickets([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    // TODO: Implement API update for ticket status
    fetchTickets();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "open":
        return "bg-secondary/20 text-secondary";
      case "in_progress":
        return "bg-accent/20 text-accent";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Support Tickets
          </h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
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
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No tickets.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {t.subject}
                    </TableCell>
                    <TableCell>{t.full_name}</TableCell>
                    <TableCell>{t.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(t.status)}`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(t.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {t.status === "open" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(t.id, "in_progress")}
                          >
                            Start
                          </Button>
                        )}
                        {t.status === "in_progress" && (
                          <Button
                            size="sm"
                            className="bg-green-600 text-white"
                            onClick={() => updateStatus(t.id, "resolved")}
                          >
                            Resolve
                          </Button>
                        )}
                        {t.status !== "closed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(t.id, "closed")}
                          >
                            Close
                          </Button>
                        )}
                      </div>
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

export default AdminSupport;
