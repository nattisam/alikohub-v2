import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { supabase } from '@/integrations/supabase/client';
import AdminLayout from "@/components/categories/technology/admin/AdminLayout";
import { Button } from "@/components/categories/technology/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/categories/technology/ui/table";
import { Plus, Pencil, Eye, Archive, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/categories/technology/use-toast";
import { programs as localPrograms } from "@/data/categories/technology/programs";
// import type { Tables } from '@/integrations/supabase/types';

type Program = any;

const AdminPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPrograms = async () => {
    // TODO: Implement API fetching for technology programs
    setPrograms([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const toggleStatus = async (program: Program) => {
    toast({ title: "Feature disabled (API pending)" });
  };

  const handleSeedPrograms = async () => {
    toast({ title: "Feature disabled (API pending)" });
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-foreground">Programs</h1>
          <div className="flex gap-2">
            {programs.length === 0 && (
              <Button
                variant="outline"
                onClick={handleSeedPrograms}
                disabled={seeding}
              >
                {seeding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Seed from Template
              </Button>
            )}
            <Button
              className="bg-accent text-accent-foreground"
              onClick={() => navigate("/technology/admin/programs/new")}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Program
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : programs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No programs yet. Use "Seed from Template" or "Add Program".
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                      {p.title}
                    </TableCell>
                    <TableCell className="capitalize">
                      {p.type.replace("_", " ")}
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.level}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(p.status)}`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>{p.featured ? "⭐" : "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            navigate(`/admin/programs/${p.id}/edit`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleStatus(p)}
                          title={
                            p.status === "published" ? "Archive" : "Publish"
                          }
                        >
                          {p.status === "published" ? (
                            <Archive className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
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

export default AdminPrograms;
