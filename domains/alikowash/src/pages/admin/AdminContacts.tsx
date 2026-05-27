import { useState } from "react";
import { useContacts, useDeleteContact } from "@/hooks/useWash";
import { washService } from "@/services/washService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminContacts() {
  const { data: items = [], isLoading, refetch } = useContacts();
  const deleteMutation = useDeleteContact();
  const [selected, setSelected] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    deleteMutation.mutate(id);
  };

  const markRead = async (contact: any) => {
    if (!contact.isRead) {
      await washService.markContactRead(contact.id);
      refetch();
    }
    setSelected(contact);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Contact Submissions
      </h1>
      <div className="grid gap-3">
        {items.map((c) => (
          <Card key={c.id} className={!c.isRead ? "border-primary/30" : ""}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!c.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                  <span className="font-semibold text-foreground">
                    {c.name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {c.email} • {c.serviceInterest || "General"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(c.createdAt || c.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => markRead(c)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`mailto:${c.email}`}>
                    <Mail className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No contact submissions yet.
          </p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div>
                <strong>Name:</strong> {selected.name}
              </div>
              <div>
                <strong>Email:</strong> {selected.email}
              </div>
              {selected.phone && (
                <div>
                  <strong>Phone:</strong> {selected.phone}
                </div>
              )}
              {selected.organization && (
                <div>
                  <strong>Organization:</strong> {selected.organization}
                </div>
              )}
              {selected.country && (
                <div>
                  <strong>Country:</strong> {selected.country}
                </div>
              )}
              {selected.serviceInterest && (
                <div>
                  <strong>Service:</strong> {selected.serviceInterest}
                </div>
              )}
              {selected.message && (
                <div>
                  <strong>Message:</strong>
                  <p className="mt-1 p-3 bg-secondary rounded-lg">
                    {selected.message}
                  </p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Submitted:{" "}
                {new Date(
                  selected.createdAt || selected.created_at,
                ).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
