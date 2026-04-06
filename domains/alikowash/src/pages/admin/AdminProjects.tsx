import { useEffect, useState } from "react";
import { washService } from "@/services/washService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  title: string;
  location: string | null;
  year_gc: string | null;
  system_type: string | null;
  capacity_m3: string | null;
  tags: string[] | null;
  summary: string | null;
  description: string | null;
  photos: string[] | null;
  partner_names: string[] | null;
  display_order: number | null;
  is_published: boolean | null;
}

const emptyProject = {
  title: "",
  location: "",
  year_gc: "",
  system_type: "",
  capacity_m3: "",
  tags: "",
  summary: "",
  description: "",
  partner_names: "",
  display_order: 0,
  is_published: true,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await washService.getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    const payload = {
      ...editingProject,
      tags: editingProject.tags
        ? typeof editingProject.tags === "string"
          ? editingProject.tags.split(",").map((t: string) => t.trim())
          : editingProject.tags
        : null,
      partner_names: editingProject.partner_names
        ? typeof editingProject.partner_names === "string"
          ? editingProject.partner_names.split(",").map((t: string) => t.trim())
          : editingProject.partner_names
        : null,
    };

    try {
      await washService.upsertProject(payload);
      toast.success("Saved!");
      setIsOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await washService.deleteProject(id);
      toast.success("Deleted!");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const openEdit = (project: Project) => {
    setEditingProject({
      ...project,
      tags: project.tags?.join(", ") || "",
      partner_names: project.partner_names?.join(", ") || "",
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Projects
        </h1>
        <Button
          onClick={() => {
            setEditingProject({ ...emptyProject });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((p: any) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">
                  {p.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {p.location} • {p.year_gc} • {p.system_type}
                  {!p.is_published && (
                    <span className="ml-2 text-destructive">(Draft)</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No projects yet. Click "Add Project" to get started.
          </p>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.id ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={editingProject.location}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        location: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={editingProject.year_gc}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        year_gc: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>System Type</Label>
                  <Input
                    value={editingProject.system_type}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        system_type: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Capacity (m³)</Label>
                  <Input
                    value={editingProject.capacity_m3}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        capacity_m3: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      summary: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editingProject.tags}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value,
                    })
                  }
                  className="mt-1"
                  placeholder="water, irrigation"
                />
              </div>
              <div>
                <Label>Partner Names (comma-separated)</Label>
                <Input
                  value={editingProject.partner_names}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      partner_names: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingProject.display_order}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        is_published: e.target.checked,
                      })
                    }
                    id="published"
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Project
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
