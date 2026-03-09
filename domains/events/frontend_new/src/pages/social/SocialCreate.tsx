import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const eventTypes = ["Wedding", "Birthday", "Bridal Shower", "Graduation", "Engagement", "Baby Shower", "Other"];
const templates = ["Elegant Gold", "Garden Romance", "Modern Minimal", "Classic White", "Tropical Vibes"];

const SocialCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    eventType: "", template: "", title: "", description: "", start_datetime: "", end_datetime: "",
    location_name: "", location_address: "", host_name: "", privacy: "public" as "public" | "link_only" | "password",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to create an event");
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
      const { data, error } = await supabase.from("events").insert({
        type: "social" as const,
        title: form.title,
        slug,
        description: form.description,
        start_datetime: form.start_datetime,
        end_datetime: form.end_datetime,
        location_name: form.location_name,
        location_address: form.location_address,
        host_name: form.host_name,
        privacy: form.privacy,
        status: "published" as const,
        theme_template_id: form.template,
        created_by: user.id,
      }).select("slug").single();
      if (error) throw error;
      return data.slug;
    },
    onSuccess: (slug) => {
      toast.success("Event created!");
      navigate(`/social/e/${slug}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <h1 className="text-3xl font-bold font-display text-foreground mb-2">Create Social Event</h1>
        <p className="text-muted-foreground font-body mb-8">Step {step} of 3</p>

        <div className="flex gap-1 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-accent" : "bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="font-body">Event Type</Label>
              <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{eventTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body">Template</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {templates.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, template: t })}
                    className={`p-4 rounded-lg border text-sm font-body text-left transition-colors ${
                      form.template === t ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent/30"
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <Button onClick={() => setStep(2)} disabled={!form.eventType} className="w-full font-body">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="font-body">Event Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sarah & John's Wedding" />
            </div>
            <div>
              <Label className="font-body">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body">Start Date/Time *</Label>
                <Input type="datetime-local" value={form.start_datetime} onChange={(e) => setForm({ ...form, start_datetime: e.target.value })} />
              </div>
              <div>
                <Label className="font-body">End Date/Time *</Label>
                <Input type="datetime-local" value={form.end_datetime} onChange={(e) => setForm({ ...form, end_datetime: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="font-body">Location</Label>
              <Input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} placeholder="Venue name" />
            </div>
            <div>
              <Label className="font-body">Host Name</Label>
              <Input value={form.host_name} onChange={(e) => setForm({ ...form, host_name: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="font-body">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.title || !form.start_datetime || !form.end_datetime} className="flex-1 font-body">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="font-body">Privacy</Label>
              <Select value={form.privacy} onValueChange={(v) => setForm({ ...form, privacy: v as "public" | "link_only" | "password" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — anyone can view</SelectItem>
                  <SelectItem value="link_only">Link Only — only people with the link</SelectItem>
                  <SelectItem value="password">Password Protected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-bold text-foreground mb-2">Summary</h3>
              <div className="space-y-1 text-sm font-body text-muted-foreground">
                <p><span className="text-foreground font-semibold">Type:</span> {form.eventType}</p>
                <p><span className="text-foreground font-semibold">Title:</span> {form.title}</p>
                <p><span className="text-foreground font-semibold">Template:</span> {form.template || "None"}</p>
                <p><span className="text-foreground font-semibold">Date:</span> {form.start_datetime}</p>
                <p><span className="text-foreground font-semibold">Location:</span> {form.location_name || "TBD"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="font-body">Back</Button>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="flex-1 font-body bg-accent text-accent-foreground hover:bg-accent/90">
                {createMutation.isPending ? "Publishing..." : "Publish Event"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer portal="social" />
    </div>
  );
};

export default SocialCreate;
