import { useState, useRef } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  bucket: string;
  folder: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  onRemoved?: () => void;
}

export function ImageUpload({
  bucket,
  folder,
  currentUrl,
  onUploaded,
  onRemoved,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      // Mock successful upload
      const mockUrl =
        "https://images.unsplash.com/photo-1576091160550-217359f4b1d3?auto=format&fit=crop&q=80&w=2070";
      onUploaded(mockUrl);
      toast.success("Image uploaded (Mock)");
      // Original Supabase upload logic commented out:
      // const ext = file.name.split(".").pop();
      // const path = `${folder}/${Date.now()}.${ext}`;
      // const { error } = await supabase.storage.from(bucket).upload(path, file);
      // if (error) throw error;

      // const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      // onUploaded(publicUrl);
      // toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
          <img
            src={currentUrl}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
          {onRemoved && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={onRemoved}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-border bg-muted/30">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3 w-3 mr-1" />
        {uploading
          ? "Uploading…"
          : currentUrl
            ? "Change Image"
            : "Upload Image"}
      </Button>
    </div>
  );
}
