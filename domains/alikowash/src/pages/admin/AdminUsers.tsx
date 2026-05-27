import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await washService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id: string | number, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "MANAGER" : "ADMIN";
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      await washService.updateUserRole(id, newRole);
      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">
          User Management
        </h1>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center py-8">Loading users...</p>
        ) : (
          users.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{u.email}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Role:{" "}
                      <span className="font-bold">{u.role || "USER"}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      ID: {u.id}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRole(u.id, u.role)}
                >
                  Change Role
                </Button>
              </CardContent>
            </Card>
          ))
        )}
        {!loading && users.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No users found or insufficient permissions.
          </p>
        )}
      </div>
    </div>
  );
}
