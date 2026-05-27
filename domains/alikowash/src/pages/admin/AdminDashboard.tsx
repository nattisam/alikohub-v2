import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  Handshake,
  MessageSquare,
  Heart,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";

interface Stats {
  projects: number;
  partners: number;
  contacts: number;
  donations: number;
  team: number;
  stories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    partners: 0,
    contacts: 0,
    donations: 0,
    team: 0,
    stories: 0,
  });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, contacts] = await Promise.all([
          washService.getStats().catch(() => ({})),
          washService.getContacts().catch(() => []),
        ]);

        setStats({
          projects: statsData.projects || 0,
          partners: statsData.partners || 0,
          contacts: statsData.contacts || 0,
          donations: statsData.donations || 0,
          team: statsData.team || 0,
          stories: statsData.stories || 0,
        });

        // Get 5 most recent contacts
        const allContacts = Array.isArray(contacts) ? contacts : [];
        setRecentContacts(allContacts.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "text-primary",
    },
    {
      label: "Partners",
      value: stats.partners,
      icon: Handshake,
      color: "text-accent",
    },
    {
      label: "Team Members",
      value: stats.team,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Story Chapters",
      value: stats.stories,
      icon: BookOpen,
      color: "text-accent",
    },
    {
      label: "Contacts",
      value: stats.contacts,
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      label: "Donations",
      value: stats.donations,
      icon: Heart,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
              <div className="text-2xl font-bold text-foreground">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentContacts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {c.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.email}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
