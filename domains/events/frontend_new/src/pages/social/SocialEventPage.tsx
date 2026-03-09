import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Heart, CheckCircle, Share2 } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const SocialEventPage = () => {
  const { slug } = useParams();
  const [rsvpForm, setRsvpForm] = useState({
    guest_name: "", guest_email: "", response: "yes" as "yes" | "no" | "maybe",
    plus_one_name: "", meal_preference: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["social-event", slug],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title, slug, description, type, status, privacy, start_datetime, end_datetime, location_name, location_address, location_map_url, host_name, cover_image_url, theme_template_id, timezone, created_by, created_at, updated_at").eq("slug", slug!).single();
      return data;
    },
    enabled: !!slug,
  });

  const rsvpMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rsvps").insert({
        event_id: event!.id,
        guest_name: rsvpForm.guest_name,
        guest_email: rsvpForm.guest_email,
        response: rsvpForm.response,
        plus_one_name: rsvpForm.plus_one_name || null,
        meal_preference: rsvpForm.meal_preference || null,
        notes: rsvpForm.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("RSVP submitted!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" /></div>;
  if (!event) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground font-body">Event not found</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar portal="social" />

      {/* Hero */}
      <section className="relative h-64 md:h-80 bg-accent/20">
        {event.cover_image_url && <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground font-display">{event.title}</h1>
            {event.host_name && <p className="text-muted-foreground font-body mt-1">Hosted by {event.host_name}</p>}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-wrap gap-4 text-sm font-body text-muted-foreground">
              <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-accent" />{format(new Date(event.start_datetime), "EEEE, MMMM d, yyyy")}</span>
              <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4 text-accent" />{format(new Date(event.start_datetime), "h:mm a")}</span>
              {event.location_name && <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent" />{event.location_name}</span>}
            </div>

            {event.description && (
              <section>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">About This Event</h2>
                <p className="text-foreground/80 font-body whitespace-pre-wrap">{event.description}</p>
              </section>
            )}

            <Button variant="outline" className="font-body" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}>
              <Share2 className="w-3.5 h-3.5 mr-2" />Share This Event
            </Button>
          </div>

          {/* RSVP Widget */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-card h-fit sticky top-20">
            {submitted ? (
              <div className="text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-accent mx-auto" />
                <h3 className="font-display font-bold text-foreground">Thank You!</h3>
                <p className="text-sm text-muted-foreground font-body">Your RSVP has been submitted.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-bold text-foreground">RSVP</h3>
                </div>
                <div>
                  <Label className="font-body">Your Name *</Label>
                  <Input value={rsvpForm.guest_name} onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })} />
                </div>
                <div>
                  <Label className="font-body">Email *</Label>
                  <Input type="email" value={rsvpForm.guest_email} onChange={(e) => setRsvpForm({ ...rsvpForm, guest_email: e.target.value })} />
                </div>
                <div>
                  <Label className="font-body">Will you attend?</Label>
                  <Select value={rsvpForm.response} onValueChange={(v) => setRsvpForm({ ...rsvpForm, response: v as "yes" | "no" | "maybe" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I'll be there!</SelectItem>
                      <SelectItem value="no">Sorry, can't make it</SelectItem>
                      <SelectItem value="maybe">Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body">Plus One Name</Label>
                  <Input value={rsvpForm.plus_one_name} onChange={(e) => setRsvpForm({ ...rsvpForm, plus_one_name: e.target.value })} placeholder="Optional" />
                </div>
                <div>
                  <Label className="font-body">Meal Preference</Label>
                  <Input value={rsvpForm.meal_preference} onChange={(e) => setRsvpForm({ ...rsvpForm, meal_preference: e.target.value })} placeholder="Optional" />
                </div>
                <div>
                  <Label className="font-body">Notes</Label>
                  <Textarea value={rsvpForm.notes} onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })} placeholder="Any message for the host" />
                </div>
                <Button
                  onClick={() => rsvpMutation.mutate()}
                  disabled={!rsvpForm.guest_name || !rsvpForm.guest_email || rsvpMutation.isPending}
                  className="w-full font-body bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {rsvpMutation.isPending ? "Submitting..." : "Submit RSVP"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer portal="social" />
    </div>
  );
};

export default SocialEventPage;
