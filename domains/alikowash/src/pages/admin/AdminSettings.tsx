import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Save, Plus } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchSettings = async () => {
    try {
      const data = await washService.getSettings();
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpsert = async (key: string, value: any) => {
    try {
      let parsedValue = value;
      try {
        if (
          typeof value === "string" &&
          (value.startsWith("{") || value.startsWith("["))
        ) {
          parsedValue = JSON.parse(value);
        }
      } catch (e) {
        // Not JSON, use as string
      }

      await washService.upsertSetting({ key, value: parsedValue });
      toast.success("Setting saved");
      fetchSettings();
      if (key === newKey) {
        setNewKey("");
        setNewValue("");
      }
    } catch (error: any) {
      toast.error("Failed to save setting");
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    try {
      await washService.deleteSetting(key);
      toast.success("Setting deleted");
      fetchSettings();
    } catch (error) {
      toast.error("Failed to delete setting");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Settings
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>User ID:</strong> {user?.id}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Site Setting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Key</Label>
              <Input
                placeholder="e.g. homepage_hero"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Value (String or JSON)</Label>
              <Input
                placeholder='e.g. {"title": "Welcome"}'
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => handleUpsert(newKey, newValue)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Setting
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Settings Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((s) => (
              <div
                key={s.key}
                className="flex gap-4 items-end border-b border-border pb-4 last:border-0"
              >
                <div className="flex-1 space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    {s.key}
                  </Label>
                  <Input
                    defaultValue={
                      typeof s.value === "object"
                        ? JSON.stringify(s.value)
                        : s.value
                    }
                    onBlur={(e) => {
                      if (
                        e.target.value !==
                        (typeof s.value === "object"
                          ? JSON.stringify(s.value)
                          : s.value)
                      ) {
                        handleUpsert(s.key, e.target.value);
                      }
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(s.key)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            {settings.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No site settings found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
