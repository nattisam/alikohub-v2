import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/categories/stem/admin/AdminLayout";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/categories/stem/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/categories/stem/ui/table";
import { Badge } from "@/components/categories/stem/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/categories/stem/utils";

interface UserRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  roles: string[];
}

const AdminUsers = () => {
  // Mock data - replace with real data when backend is available
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  const changeRole = async (userId: string, newRole: string) => {
    // Mock update - replace with real API call when backend is available
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, roles: [newRole] } : u)));
    toast.success(`Role changed to ${newRole}`);
  };

  const roleColors: Record<string, string> = {
    student: "bg-muted text-muted-foreground",
    admin: "bg-primary/15 text-primary border-primary/30",
    superadmin: "bg-accent-green/15 text-accent-green border-accent-green/30",
  };

  return (
    <AdminLayout title="Users">
      <>
        <div className="mb-6">
            <Badge variant="outline" className="font-bold">{users.length} users</Badge>
          </div>
          <div className="border border-divider rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Phone</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Joined</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || "â€”"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.phone || "â€”"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {isSuperadmin ? (
                        <Select value={u.roles[0] || "student"} onValueChange={(v) => changeRole(u.id, v)}>
                          <SelectTrigger className="w-36 h-8">
                            <Badge variant="outline" className={cn("text-xs", roleColors[u.roles[0]] || "")}>{u.roles[0] || "student"}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className={cn("text-xs", roleColors[u.roles[0]] || "")}>{u.roles[0] || "student"}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
    </AdminLayout>
  );
};

export default AdminUsers;
