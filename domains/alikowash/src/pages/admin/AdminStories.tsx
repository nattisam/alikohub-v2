import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const empty = {
  year: "",
  projectName: "",
  storyText: "",
  tags: "",
  orderIndex: 0,
  isPublished: true,
};

export default function AdminStories() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const data = await washService.getStories();
    setItems(data || []);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    const payload: any = {
      year: Number(editing.year),
      projectName: editing.projectName,
      storyText: editing.storyText,
      orderIndex: Number(editing.orderIndex || 0),
      isPublished: editing.isPublished,
      photos: editing.photos || [],
      captions: editing.captions || [],
      tags: editing.tags
        ? typeof editing.tags === "string"
          ? editing.tags.split(",").map((t: string) => t.trim())
          : editing.tags
        : [],
    };

    if (editing.id) {
      payload.id = editing.id;
    }

    try {
      await washService.upsertStory(payload);
      toast({ title: "Saved!" });
      setIsOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await washService.deleteStory(id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Story Chapters
        </h1>
        <Button
          onClick={() => {
            setEditing({ ...empty });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Chapter
        </Button>
      </div>
      <div className="grid gap-4">
        {items.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-foreground">
                  {s.year} — {s.projectName}
                </div>
                <div className="text-sm text-muted-foreground truncate max-w-md">
                  {s.storyText?.slice(0, 80)}...
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing({ ...s, tags: s.tags?.join(", ") || "" });
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(s.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No story chapters yet.
          </p>
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit" : "New"} Story Chapter
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Year *</Label>
                  <Input
                    value={editing.year}
                    onChange={(e) =>
                      setEditing({ ...editing, year: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Order Index</Label>
                  <Input
                    type="number"
                    value={editing.orderIndex}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        orderIndex: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={editing.projectName}
                  onChange={(e) =>
                    setEditing({ ...editing, projectName: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Story Text</Label>
                <Textarea
                  value={editing.storyText || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, storyText: e.target.value })
                  }
                  className="mt-1"
                  rows={5}
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editing.tags}
                  onChange={(e) =>
                    setEditing({ ...editing, tags: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.isPublished}
                  onChange={(e) =>
                    setEditing({ ...editing, isPublished: e.target.checked })
                  }
                  id="pub"
                />
                <Label htmlFor="pub">Published</Label>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
