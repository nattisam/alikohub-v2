import { useState } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LmsNavbar from "@/components/LmsNavbar";
import { useToast } from "@/hooks/use-toast";

const LmsPhoto = () => {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      toast({ title: "Photo uploaded", description: "Click save to apply your new photo." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LmsNavbar />
      <div className="section-container max-w-2xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Photo</h1>
        </div>

        <div className="bg-card rounded-xl border p-8">
          <p className="text-sm text-muted-foreground mb-6">Add a nice photo of yourself for your profile. Image must be at least 200×200 pixels.</p>
          <div className="flex flex-col items-center gap-6">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-muted">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No photo</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 relative">
                <Upload className="w-4 h-4" /> Upload Photo
                <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
              </Button>
              {preview && (
                <Button variant="ghost" className="gap-2 text-destructive" onClick={() => setPreview(null)}>
                  <Trash2 className="w-4 h-4" /> Remove
                </Button>
              )}
            </div>
            {preview && <Button className="mt-2" onClick={() => toast({ title: "Photo saved!" })}>Save Photo</Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LmsPhoto;
