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
  projectName: string;
  year: number | string;
  storyText: string | null;
  location?: string | null;
  systemType?: string | null;
  capacityM3?: number | null;
  tags: string[] | null;
  photos: string[] | null;
  captions: string[] | null;
  orderIndex: number;
  isPublished: boolean;
}

const emptyProject = {
  projectName: "",
  year: new Date().getFullYear(),
  storyText: "",
  tags: "",
  orderIndex: 0,
  isPublished: true,
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
      projectName: editingProject.projectName || editingProject.title,
      year: Number(editingProject.year || editingProject.yearGc),
      storyText:
        editingProject.storyText ||
        editingProject.summary ||
        editingProject.description,
      orderIndex: Number(
        editingProject.orderIndex || editingProject.displayOrder || 0,
      ),
      isPublished: editingProject.isPublished,
      photos: editingProject.photos || [],
      captions: editingProject.captions || [],
      tags: editingProject.tags
        ? typeof editingProject.tags === "string"
          ? editingProject.tags.split(",").map((t: string) => t.trim())
          : editingProject.tags
        : [],
    };

    // If editing, include the ID but remove metadata
    if (editingProject.id) {
      (payload as any).id = editingProject.id;
    }

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
                  {p.projectName || p.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {p.year}
                  {!p.isPublished && (
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
                <Label>Project Name *</Label>
                <Input
                  value={editingProject.projectName}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      projectName: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  value={editingProject.year}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      year: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description / Story Text</Label>
                <Textarea
                  value={editingProject.storyText || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      storyText: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={5}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Index</Label>
                  <Input
                    type="number"
                    value={editingProject.orderIndex}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        orderIndex: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        isPublished: e.target.checked,
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
