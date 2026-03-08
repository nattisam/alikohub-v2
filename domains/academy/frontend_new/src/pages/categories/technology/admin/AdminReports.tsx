import { useEffect, useState } from "react";
// import { supabase } from '@/integrations/supabase/client';
import AdminLayout from "@/components/categories/technology/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/categories/technology/ui/card";
import { Button } from "@/components/categories/technology/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/categories/technology/ui/table";
import {
  Download,
  BarChart3,
  ClipboardList,
  GraduationCap,
  HeadphonesIcon,
} from "lucide-react";

const AdminReports = () => {
  const [stats, setStats] = useState({
    programsByCategory: [] as { category: string; count: number }[],
    applicationsByStatus: [] as { status: string; count: number }[],
    cohortFill: [] as { name: string; capacity: number; filled: number }[],
    ticketsByStatus: [] as { status: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API fetching for report stats
    setStats({
      programsByCategory: [
        { category: "Software Engineering", count: 5 },
        { category: "Data & Analytics", count: 3 },
        { category: "AI & Machine Learning", count: 2 },
      ],
      applicationsByStatus: [
        { status: "new", count: 12 },
        { status: "reviewing", count: 8 },
        { status: "accepted", count: 25 },
      ],
      cohortFill: [
        { name: "Full Stack Sprint A", capacity: 30, filled: 28 },
        { name: "Data Sci B", capacity: 25, filled: 20 },
      ],
      ticketsByStatus: [
        { status: "open", count: 3 },
        { status: "closed", count: 45 },
      ],
    });
    setLoading(false);
  }, []);

  const exportCSV = (data: Record<string, any>[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading reports...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Programs by Category */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" /> Programs by
                  Category
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    exportCSV(stats.programsByCategory, "programs-by-category")
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {stats.programsByCategory.map((r) => (
                      <TableRow key={r.category}>
                        <TableCell className="text-foreground">
                          {r.category}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {r.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Applications by Status */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-secondary" />{" "}
                  Applications by Status
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    exportCSV(
                      stats.applicationsByStatus,
                      "applications-by-status",
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {stats.applicationsByStatus.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          No applications yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.applicationsByStatus.map((r) => (
                        <TableRow key={r.status}>
                          <TableCell className="text-foreground capitalize">
                            {r.status}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {r.count}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Ticket Stats */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HeadphonesIcon className="h-5 w-5 text-destructive" />{" "}
                  Tickets by Status
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    exportCSV(stats.ticketsByStatus, "tickets-by-status")
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {stats.ticketsByStatus.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          No tickets yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.ticketsByStatus.map((r) => (
                        <TableRow key={r.status}>
                          <TableCell className="text-foreground capitalize">
                            {r.status.replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {r.count}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Cohort Fill */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" /> Cohort Capacity
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => exportCSV(stats.cohortFill, "cohort-capacity")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {stats.cohortFill.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-muted-foreground">
                          No cohorts yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.cohortFill.map((r) => (
                        <TableRow key={r.name}>
                          <TableCell className="text-foreground">
                            {r.name}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {r.capacity}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
