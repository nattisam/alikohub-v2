import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Film, Image as ImageIcon, Upload } from "lucide-react";

const professionalCategories = ["Business Summit", "Education Forum", "Tech Fair", "Conference", "Corporate Event", "Media Launch"];
const socialCategories = ["Wedding", "Birthday", "Bridal Shower", "Graduation", "Engagement", "Anniversary", "Celebration"];

const AdminMedia = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [portal, setPortal] = useState<string>("professional");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    media_type: "image" as "image" | "video",
    media_url: "",
    thumbnail_url: "",
  });

  const categories = portal === "professional" ? professionalCategories : socialCategories;

  const { data: media = [], isLoading } = useQuery({
    queryKey: ["admin-portfolio-media", portal],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_media")
        .select("*")
        .eq("portal", portal)
        .order("category")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (file: File, field: "media_url" | "thumbnail_url") => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `portfolio/${portal}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("event-images").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(path);
    setForm((f) => ({ ...f, [field]: urlData.publicUrl }));
    setUploading(false);
    toast.success("File uploaded!");
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("portfolio_media").insert({
        portal,
        category: form.category,
        title: form.title,
        description: form.description || null,
        media_type: form.media_type,
        media_url: form.media_url,
        thumbnail_url: form.thumbnail_url || null,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Media added!");
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio-media"] });
      setShowForm(false);
      setForm({ category: "", title: "", description: "", media_type: "image", media_url: "", thumbnail_url: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_media").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio-media"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const grouped = media.reduce<Record<string, typeof media>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Portfolio & Gallery Media</h1>
          <p className="text-sm text-muted-foreground font-body">Manage images and videos for portfolio and gallery sections</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="font-body">
          <Plus className="w-4 h-4 mr-2" /> Add Media
        </Button>
      </div>

      {/* Portal toggle */}
      <div className="flex gap-2 mb-6">
        <Button variant={portal === "professional" ? "default" : "outline"} size="sm" onClick={() => setPortal("professional")} className="font-body">
          Professional Portfolio
        </Button>
        <Button variant={portal === "social" ? "default" : "outline"} size="sm" onClick={() => setPortal("social")} className="font-body">
          Social Gallery
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body">Media Type *</Label>
              <Select value={form.media_type} onValueChange={(v) => setForm({ ...form, media_type: v as "image" | "video" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="font-body">Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label className="font-body">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Media File *</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept={form.media_type === "video" ? "video/*" : "image/*"}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "media_url")}
                />
              </div>
              {form.media_url && <p className="text-xs text-primary mt-1 truncate">✓ Uploaded</p>}
            </div>
            <div>
              <Label className="font-body">Thumbnail (for videos)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "thumbnail_url")}
              />
              {form.thumbnail_url && <p className="text-xs text-primary mt-1 truncate">✓ Uploaded</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="font-body">Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!form.category || !form.title || !form.media_url || createMutation.isPending || uploading}
              className="font-body"
            >
              {uploading ? "Uploading..." : createMutation.isPending ? "Saving..." : "Save Media"}
            </Button>
          </div>
        </div>
      )}

      {/* Media grid by category */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-body">No media uploaded yet. Click "Add Media" to get started.</div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-display font-bold text-foreground mb-3">{category}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden bg-muted border border-border group">
                  <div className="aspect-video">
                    {item.media_type === "video" ? (
                      <video src={item.media_url} poster={item.thumbnail_url || undefined} className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.media_type === "video" ? <Film className="w-3 h-3 text-muted-foreground" /> : <ImageIcon className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs font-body font-semibold text-foreground truncate">{item.title}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMedia;
