import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, File as FileIcon, X } from "lucide-react";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  lessonId: string;
  isAdding: boolean;
}

export const ContentModal = ({
  isOpen,
  onClose,
  onAdd,
  lessonId,
  isAdding,
}: ContentModalProps) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"PDF" | "VIDEO" | "TEXT">("PDF");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setType("PDF");
    setUrl("");
    setFile(null);
  };

  const handleAdd = () => {
    if (!title) return;

    if (file) {
      const formData = new FormData();
      formData.append("lessonId", lessonId);
      formData.append("title", title);
      formData.append("contentType", type);
      formData.append("file", file);
      onAdd(formData);
    } else {
      onAdd({
        lessonId: Number(lessonId),
        title,
        type,
        url,
      });
    }
    // Form is usually reset in the parent after success,
    // but we can clear local state if we want.
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Content to Lesson</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Content Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 1 PDF"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Content Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "PDF", icon: FileIcon, label: "PDF" },
                { id: "VIDEO", icon: Upload, label: "Video" },
                { id: "TEXT", icon: LinkIcon, label: "Text/Link" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 ${
                    type === t.id
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-slate-100 hover:border-slate-200 text-slate-500"
                  }`}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-slate-100/50 p-1">
              <TabsTrigger
                value="upload"
                className="font-bold data-[state=active]:bg-white"
              >
                Upload File
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="font-bold data-[state=active]:bg-white"
              >
                External Link
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4 pt-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer relative bg-slate-50/50">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="flex flex-col items-center">
                  {file ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                        <FileIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-900 font-bold max-w-[200px] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        Click or drag to{" "}
                        <span className="text-accent font-bold">
                          upload file
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                        PDF, MP4 or Document
                      </p>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Content URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-11 pl-10"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Direct link to external resources
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose} className="font-bold">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={isAdding || !title || (!file && !url)}
            className="bg-accent hover:bg-amber-light text-slate-900 font-bold px-8 shadow-lg shadow-accent/20"
          >
            {isAdding ? "Adding..." : "Add Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
