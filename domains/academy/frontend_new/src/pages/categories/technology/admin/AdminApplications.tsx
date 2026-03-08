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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/categories/technology/ui/tabs";
// import type { Tables } from '@/integrations/supabase/types';
import { format } from "date-fns";

type Application = any;

const statusTabs = ["new", "reviewing", "accepted", "rejected"] as const;

const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("new");

  const fetchApplications = async () => {
    // TODO: Implement API fetching for applications
    setApplications([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    // TODO: Implement API update for application status
    fetchApplications();
  };

  const filtered = applications.filter((a) => a.status === activeTab);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize">
                {tab} ({applications.filter((a) => a.status === tab).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="border border-border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No {activeTab} applications.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium text-foreground">
                          {app.full_name}
                        </TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.phone || "—"}</TableCell>
                        <TableCell>
                          {format(new Date(app.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {activeTab === "new" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateStatus(app.id, "reviewing")
                                }
                              >
                                Review
                              </Button>
                            )}
                            {activeTab === "reviewing" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 text-white"
                                  onClick={() =>
                                    updateStatus(app.id, "accepted")
                                  }
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    updateStatus(app.id, "rejected")
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
