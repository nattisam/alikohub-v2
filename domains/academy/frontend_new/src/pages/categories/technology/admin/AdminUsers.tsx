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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/categories/technology/ui/dialog";
import { Label } from "@/components/categories/technology/ui/label";
import { useToast } from "@/hooks/categories/technology/use-toast";
import { useAuth } from "@/hooks/categories/technology/useAuth";
// import type { Tables, Database } from '@/integrations/supabase/types';
import { format } from "date-fns";
import { Shield, Loader2 } from "lucide-react";

type Profile = any;
type AppRole = any;

interface UserWithRoles extends Profile {
  roles: AppRole[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const fetchUsers = async () => {
    // TODO: Implement API fetching for users
    setUsers([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openRoleDialog = (user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRole(user.roles[0] || "");
    setDialogOpen(true);
  };

  const handleAssignRole = async () => {
    toast({ title: "Feature disabled (API pending)" });
    setDialogOpen(false);
  };

  const handleRemoveRole = async () => {
    toast({ title: "Feature disabled (API pending)" });
    setDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Users & Roles</h1>
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
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
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium text-foreground">
                      {u.full_name || "—"}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.roles.length > 0 ? (
                        u.roles.map((r) => (
                          <span
                            key={r}
                            className="inline-block mr-1 px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent capitalize"
                          >
                            {r.replace("_", " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          No role
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{u.status}</TableCell>
                    <TableCell>
                      {format(new Date(u.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {hasRole("super_admin") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(u)}
                        >
                          <Shield className="h-4 w-4 mr-1" /> Manage Role
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                Manage Role — {selectedUser?.full_name || selectedUser?.email}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="program_admin">Program Admin</SelectItem>
                    <SelectItem value="enrollment_officer">
                      Enrollment Officer
                    </SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAssignRole}
                  disabled={saving || !selectedRole}
                  className="flex-1 bg-accent text-accent-foreground"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{" "}
                  Assign Role
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveRole}
                  disabled={saving}
                >
                  Remove Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
