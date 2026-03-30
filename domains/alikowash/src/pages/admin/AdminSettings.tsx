import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>User ID:</strong> {user?.id}</div>
            <div><strong>Last Sign In:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
