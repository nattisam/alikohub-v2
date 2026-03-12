import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

type Rule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  bufferMinutes: number;
  consultationType: "BUSINESS" | "CAREER" | "TRAVEL";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AdminSettings = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const { toast } = useToast();

  const fetchRules = async () => {
    try {
      const { data } = await api.get("/consultancy/availability/rules");
      setRules(data || []);
    } catch (e) {
      toast({ title: "Error", description: "Failed to fetch rules.", variant: "destructive" });
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const formatTimeForPrisma = (timeStr: string) => {
    // If it's already HH:mm:ss, return it. If HH:mm, add :00.
    if (timeStr.split(":").length === 2) return `${timeStr}:00`;
    return timeStr;
  };

  const parseTimeFromPrisma = (timeData: string) => {
    if (!timeData) return "";
    // If it's 1970-01-01T09:00:00.000Z
    if (timeData.includes("T")) {
      try {
        const date = new Date(timeData);
        return date.getUTCHours().toString().padStart(2, '0') + ':' + date.getUTCMinutes().toString().padStart(2, '0');
      } catch {
        return timeData;
      }
    }
    // If it's already HH:mm:ss or HH:mm
    return timeData.slice(0, 5);
  };

  const addRule = async () => {
    try {
      await api.post("/consultancy/availability/rules", {
        dayOfWeek: 1,
        startTime: formatTimeForPrisma("09:00"),
        endTime: formatTimeForPrisma("17:00"),
        slotDurationMinutes: 30,
        bufferMinutes: 10,
        consultationType: "BUSINESS",
        isActive: true,
      });
      fetchRules();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to add rule.", variant: "destructive" });
    }
  };

  const updateRule = async (id: string, updates: Partial<Rule>) => {
    try {
      const payload: any = { ...updates };
      if (updates.startTime) payload.startTime = formatTimeForPrisma(updates.startTime);
      if (updates.endTime) payload.endTime = formatTimeForPrisma(updates.endTime);

      await api.patch(`/consultancy/availability/rules/${id}`, payload);
      fetchRules();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update rule.", variant: "destructive" });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      await api.delete(`/consultancy/availability/rules/${id}`);
      toast({ title: "Rule Deleted" });
      fetchRules();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete rule.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage availability rules and booking settings.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-primary">Availability Rules</h2>
          <Button onClick={addRule} className="bg-gold text-navy hover:bg-gold/90 font-semibold" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Rule
          </Button>
        </div>
        <div className="space-y-3">
          {rules.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
              <Select value={String(r.dayOfWeek)} onValueChange={(v) => updateRule(r.id, { dayOfWeek: parseInt(v) })}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>{days.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="time" value={parseTimeFromPrisma(r.startTime)} onChange={(e) => updateRule(r.id, { startTime: e.target.value } as any)} className="w-[120px]" />
              <span className="text-sm text-muted-foreground">to</span>
              <Input type="time" value={parseTimeFromPrisma(r.endTime)} onChange={(e) => updateRule(r.id, { endTime: e.target.value } as any)} className="w-[120px]" />
              <Input type="number" value={r.slotDurationMinutes} onChange={(e) => updateRule(r.id, { slotDurationMinutes: parseInt(e.target.value) })} className="w-[80px]" placeholder="Duration" />
              <span className="text-xs text-muted-foreground">min</span>
              <Select value={r.consultationType} onValueChange={(v) => updateRule(r.id, { consultationType: v as any })}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="CAREER">Career</SelectItem>
                  <SelectItem value="TRAVEL">Travel</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Switch checked={r.isActive} onCheckedChange={(v) => updateRule(r.id, { isActive: v })} />
                <span className="text-xs">{r.isActive ? "Active" : "Inactive"}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteRule(r.id)} className="text-destructive ml-auto"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
          {rules.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No availability rules. Add one to get started.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
