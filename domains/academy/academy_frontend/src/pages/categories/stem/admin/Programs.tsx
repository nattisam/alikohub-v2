import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/categories/stem/admin/AdminLayout";
import { Badge } from "@/components/categories/stem/ui/badge";
import { Switch } from "@/components/categories/stem/ui/switch";
import { Input } from "@/components/categories/stem/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/categories/stem/ui/table";
import { Button } from "@/components/categories/stem/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface ProgramRow {
  id: string;
  title: string;
  slug: string;
  domain: string;
  level: string;
  is_published: boolean;
  sort_order: number;
}

const AdminPrograms = () => {
  // Mock data - replace with real data when backend is available
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [search, setSearch] = useState("");

  const togglePublish = async (id: string, current: boolean) => {
    // Mock update - replace with real API call when backend is available
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p)));
    toast.success(!current ? "Published" : "Unpublished");
  };

  const updateSortOrder = async (id: string, newOrder: number) => {
    // Mock update - replace with real API call when backend is available
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, sort_order: newOrder } : p)));
  };

  const filtered = programs.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Programs">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Badge variant="outline" className="font-bold">{filtered.length} programs</Badge>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="border border-divider rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="font-bold">Title</TableHead>
                <TableHead className="font-bold">Domain</TableHead>
                <TableHead className="font-bold">Level</TableHead>
                <TableHead className="font-bold">Order</TableHead>
                <TableHead className="font-bold">Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.domain}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{p.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-16 h-8 text-center"
                      value={p.sort_order}
                      onChange={(e) => updateSortOrder(p.id, parseInt(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch checked={p.is_published} onCheckedChange={() => togglePublish(p.id, p.is_published)} />
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

export default AdminPrograms;
