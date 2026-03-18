import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/categories/health/admin/AdminLayout";
// import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/categories/health/admin/ImageUpload";

interface Category {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  overview: string | null;
  icon: string | null;
  image_url: string | null;
  target_audience: string[];
  duration_options: string[];
  delivery_formats: string[];
  certification_types: string[];
  ideal_for: string[];
  display_order: number;
  is_active: boolean;
}

interface Program {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  delivery: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyCategory = {
  name: "",
  short_name: "",
  slug: "",
  overview: "",
  icon: "BookOpen",
  image_url: null as string | null,
  target_audience: "",
  duration_options: "",
  delivery_formats: "",
  certification_types: "",
  ideal_for: "",
  display_order: 0,
  is_active: true,
};

const emptyProgram = {
  title: "",
  description: "",
  duration: "",
  delivery: "",
  image_url: null as string | null,
  display_order: 0,
  is_active: true,
};

export default function AdminInstitutional() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [progDialogOpen, setProgDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingProg, setEditingProg] = useState<Program | null>(null);
  const [activeCatId, setActiveCatId] = useState<string>("");
  const [catForm, setCatForm] = useState(emptyCategory);
  const [progForm, setProgForm] = useState(emptyProgram);

  const fetchData = async () => {
    // TODO: Implement API fetching for institutional data
    setCategories([]);
    setPrograms([]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCatDialog = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({
        name: cat.name,
        short_name: cat.short_name,
        slug: cat.slug,
        overview: cat.overview || "",
        icon: cat.icon || "BookOpen",
        image_url: cat.image_url || null,
        target_audience: (cat.target_audience || []).join(", "),
        duration_options: (cat.duration_options || []).join(", "),
        delivery_formats: (cat.delivery_formats || []).join(", "),
        certification_types: (cat.certification_types || []).join(", "),
        ideal_for: (cat.ideal_for || []).join(", "),
        display_order: cat.display_order,
        is_active: cat.is_active,
      });
    } else {
      setEditingCat(null);
      setCatForm({ ...emptyCategory, display_order: categories.length });
    }
    setCatDialogOpen(true);
  };

  const saveCat = async () => {
    const toArr = (s: string) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    const payload = {
      name: catForm.name,
      short_name: catForm.short_name,
      slug: catForm.slug,
      overview: catForm.overview || null,
      icon: catForm.icon || "BookOpen",
      image_url: catForm.image_url || null,
      target_audience: toArr(catForm.target_audience),
      duration_options: toArr(catForm.duration_options),
      delivery_formats: toArr(catForm.delivery_formats),
      certification_types: toArr(catForm.certification_types),
      ideal_for: toArr(catForm.ideal_for),
      display_order: catForm.display_order,
      is_active: catForm.is_active,
    };
    toast.success("Feature disabled (API pending)");
    setCatDialogOpen(false);
  };

  const deleteCat = async (id: string) => {
    toast.info("Feature disabled");
  };

  const openProgDialog = (catId: string, prog?: Program) => {
    setActiveCatId(catId);
    if (prog) {
      setEditingProg(prog);
      setProgForm({
        title: prog.title,
        description: prog.description || "",
        duration: prog.duration || "",
        delivery: prog.delivery || "",
        image_url: prog.image_url || null,
        display_order: prog.display_order,
        is_active: prog.is_active,
      });
    } else {
      setEditingProg(null);
      const count = programs.filter((p) => p.category_id === catId).length;
      setProgForm({ ...emptyProgram, display_order: count });
    }
    setProgDialogOpen(true);
  };

  const saveProg = async () => {
    const payload = {
      category_id: activeCatId,
      title: progForm.title,
      description: progForm.description || null,
      duration: progForm.duration || null,
      delivery: progForm.delivery || null,
      image_url: progForm.image_url || null,
      display_order: progForm.display_order,
      is_active: progForm.is_active,
    };
    toast.success("Feature disabled (API pending)");
    setProgDialogOpen(false);
  };

  const deleteProg = async (id: string) => {
    toast.info("Feature disabled");
  };

  const toggleActive = async (
    table: "institutional_categories" | "institutional_programs",
    id: string,
    current: boolean,
  ) => {
    toast.info("Feature disabled");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Institutional Training
            </h1>
            <p className="text-sm text-muted-foreground">
              {categories.length} categories · {programs.length} programs
            </p>
          </div>
          <Button onClick={() => openCatDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {categories.map((cat) => {
          const catProgs = programs.filter((p) => p.category_id === cat.id);
          const expanded = expandedCat === cat.id;
          return (
            <Card key={cat.id}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedCat(expanded ? null : cat.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {cat.image_url && (
                      <img
                        src={cat.image_url}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <CardTitle className="text-lg">{cat.name}</CardTitle>
                    <Badge variant={cat.is_active ? "default" : "secondary"}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {catProgs.length} programs
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Switch
                      checked={cat.is_active}
                      onCheckedChange={() =>
                        toggleActive(
                          "institutional_categories",
                          cat.id,
                          cat.is_active,
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openCatDialog(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCat(cat.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expanded && (
                <CardContent>
                  <div className="flex justify-end mb-4">
                    <Button size="sm" onClick={() => openProgDialog(cat.id)}>
                      <Plus className="mr-1 h-3 w-3" /> Add Program
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catProgs.map((prog) => (
                        <TableRow key={prog.id}>
                          <TableCell>
                            {prog.image_url ? (
                              <img
                                src={prog.image_url}
                                alt=""
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted text-xs flex items-center justify-center text-muted-foreground">
                                N/A
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {prog.title}
                          </TableCell>
                          <TableCell>{prog.duration}</TableCell>
                          <TableCell>{prog.delivery}</TableCell>
                          <TableCell>
                            <Switch
                              checked={prog.is_active}
                              onCheckedChange={() =>
                                toggleActive(
                                  "institutional_programs",
                                  prog.id,
                                  prog.is_active,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openProgDialog(cat.id, prog)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteProg(prog.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {catProgs.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-muted-foreground py-6"
                          >
                            No programs yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Category Dialog */}
        <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCat ? "Edit Category" : "New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Thumbnail Image</label>
                <ImageUpload
                  bucket="program-images"
                  folder="institutional-categories"
                  currentUrl={catForm.image_url}
                  onUploaded={(url) =>
                    setCatForm({ ...catForm, image_url: url })
                  }
                  onRemoved={() => setCatForm({ ...catForm, image_url: null })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm({ ...catForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Short Name</label>
                  <Input
                    value={catForm.short_name}
                    onChange={(e) =>
                      setCatForm({ ...catForm, short_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={catForm.slug}
                    onChange={(e) =>
                      setCatForm({ ...catForm, slug: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Icon</label>
                  <Input
                    value={catForm.icon}
                    onChange={(e) =>
                      setCatForm({ ...catForm, icon: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Overview</label>
                <Textarea
                  value={catForm.overview}
                  onChange={(e) =>
                    setCatForm({ ...catForm, overview: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Target Audience (comma-separated)
                </label>
                <Input
                  value={catForm.target_audience}
                  onChange={(e) =>
                    setCatForm({ ...catForm, target_audience: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Duration Options (comma-separated)
                </label>
                <Input
                  value={catForm.duration_options}
                  onChange={(e) =>
                    setCatForm({ ...catForm, duration_options: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Delivery Formats (comma-separated)
                </label>
                <Input
                  value={catForm.delivery_formats}
                  onChange={(e) =>
                    setCatForm({ ...catForm, delivery_formats: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Certification Types (comma-separated)
                </label>
                <Input
                  value={catForm.certification_types}
                  onChange={(e) =>
                    setCatForm({
                      ...catForm,
                      certification_types: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Ideal For (comma-separated)
                </label>
                <Input
                  value={catForm.ideal_for}
                  onChange={(e) =>
                    setCatForm({ ...catForm, ideal_for: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium">Order</label>
                  <Input
                    type="number"
                    className="w-20"
                    value={catForm.display_order}
                    onChange={(e) =>
                      setCatForm({
                        ...catForm,
                        display_order: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <Switch
                    checked={catForm.is_active}
                    onCheckedChange={(v) =>
                      setCatForm({ ...catForm, is_active: v })
                    }
                  />
                  <span className="text-sm">Active</span>
                </div>
              </div>
              <Button onClick={saveCat} className="w-full">
                {editingCat ? "Update" : "Create"} Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Program Dialog */}
        <Dialog open={progDialogOpen} onOpenChange={setProgDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProg ? "Edit Program" : "New Program"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Thumbnail Image</label>
                <ImageUpload
                  bucket="program-images"
                  folder="institutional-programs"
                  currentUrl={progForm.image_url}
                  onUploaded={(url) =>
                    setProgForm({ ...progForm, image_url: url })
                  }
                  onRemoved={() =>
                    setProgForm({ ...progForm, image_url: null })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={progForm.title}
                  onChange={(e) =>
                    setProgForm({ ...progForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={progForm.description}
                  onChange={(e) =>
                    setProgForm({ ...progForm, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={progForm.duration}
                    onChange={(e) =>
                      setProgForm({ ...progForm, duration: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery</label>
                  <Input
                    value={progForm.delivery}
                    onChange={(e) =>
                      setProgForm({ ...progForm, delivery: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium">Order</label>
                  <Input
                    type="number"
                    className="w-20"
                    value={progForm.display_order}
                    onChange={(e) =>
                      setProgForm({
                        ...progForm,
                        display_order: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <Switch
                    checked={progForm.is_active}
                    onCheckedChange={(v) =>
                      setProgForm({ ...progForm, is_active: v })
                    }
                  />
                  <span className="text-sm">Active</span>
                </div>
              </div>
              <Button onClick={saveProg} className="w-full">
                {editingProg ? "Update" : "Create"} Program
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
