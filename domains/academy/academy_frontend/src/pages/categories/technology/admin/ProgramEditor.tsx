import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { supabase } from '@/integrations/supabase/client';
import AdminLayout from "@/components/categories/technology/admin/AdminLayout";
import { Button } from "@/components/categories/technology/ui/button";
import { Input } from "@/components/categories/technology/ui/input";
import { Label } from "@/components/categories/technology/ui/label";
import { Textarea } from "@/components/categories/technology/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/categories/technology/ui/select";
import { Switch } from "@/components/categories/technology/ui/switch";
import { useToast } from "@/hooks/categories/technology/use-toast";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";

const categories = [
  "Software Engineering",
  "Data & Analytics",
  "AI & Machine Learning",
  "Cloud & DevOps",
  "Cybersecurity",
  "Low-Code & Business Apps",
];

const ProgramEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [highlights, setHighlights] = useState<
    { id?: string; bullet_text: string; sort_order: number }[]
  >([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "career_path",
    short_summary: "",
    description: "",
    duration: "",
    level: "Beginner",
    delivery_mode: "Online",
    tuition: "",
    weekly_hours: "",
    credential: "",
    category: "",
    featured: false,
    status: "draft",
    skills: "" as string,
  });

  useEffect(() => {
    if (!isNew && id) {
      const fetchProgram = async () => {
        // TODO: Implement API fetching for program details
        setLoading(false);
      };
      fetchProgram();
    }
  }, [id, isNew]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.category) {
      toast({
        title: "Missing fields",
        description: "Title, slug, and category are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      toast({ title: "Feature disabled (API pending)" });
      setSaving(false);
      navigate("/technology/admin/programs");
    }, 500);
  };

  const addHighlight = () => {
    setHighlights((prev) => [
      ...prev,
      { bullet_text: "", sort_order: prev.length },
    ]);
  };

  const removeHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, text: string) => {
    setHighlights((prev) =>
      prev.map((h, i) => (i === index ? { ...h, bullet_text: text } : h)),
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/technology/admin/programs")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "New Program" : "Edit Program"}
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-accent-foreground"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Program title"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: e.target.value }))
                }
                placeholder="program-slug"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="career_path">Career Path</SelectItem>
                  <SelectItem value="short_course">Short Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={form.level}
                onValueChange={(v) => setForm((p) => ({ ...p, level: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Short Summary (2 lines max)</Label>
            <Textarea
              value={form.short_summary}
              onChange={(e) =>
                setForm((p) => ({ ...p, short_summary: e.target.value }))
              }
              rows={2}
              maxLength={200}
              placeholder="Brief program description"
            />
          </div>

          <div className="space-y-2">
            <Label>Full Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={5}
              placeholder="Detailed program description"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={form.duration}
                onChange={(e) =>
                  setForm((p) => ({ ...p, duration: e.target.value }))
                }
                placeholder="24 weeks"
              />
            </div>
            <div className="space-y-2">
              <Label>Weekly Hours</Label>
              <Input
                value={form.weekly_hours}
                onChange={(e) =>
                  setForm((p) => ({ ...p, weekly_hours: e.target.value }))
                }
                placeholder="20-25 hrs/week"
              />
            </div>
            <div className="space-y-2">
              <Label>Tuition</Label>
              <Input
                value={form.tuition}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tuition: e.target.value }))
                }
                placeholder="$8,500"
              />
            </div>
            <div className="space-y-2">
              <Label>Credential</Label>
              <Input
                value={form.credential}
                onChange={(e) =>
                  setForm((p) => ({ ...p, credential: e.target.value }))
                }
                placeholder="Professional Certificate"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills (comma-separated)</Label>
            <Input
              value={form.skills}
              onChange={(e) =>
                setForm((p) => ({ ...p, skills: e.target.value }))
              }
              placeholder="JavaScript, React, Node.js"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Delivery Mode</Label>
              <Select
                value={form.delivery_mode}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, delivery_mode: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => setForm((p) => ({ ...p, featured: v }))}
              />
              <Label>Featured Program</Label>
            </div>
          </div>
        </div>

        {/* Highlights / What You'll Learn */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              What You'll Learn (Highlights)
            </h2>
            <Button variant="outline" size="sm" onClick={addHighlight}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-6">
                {i + 1}.
              </span>
              <Input
                value={h.bullet_text}
                onChange={(e) => updateHighlight(i, e.target.value)}
                placeholder="Learning outcome"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHighlight(i)}
                className="text-destructive h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {highlights.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No highlights yet. Click "Add" to create bullet points.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProgramEditor;
