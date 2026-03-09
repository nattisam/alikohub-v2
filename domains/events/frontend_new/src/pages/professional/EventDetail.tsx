import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Clock, Share2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const EventDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", ticket_id: "" });
  const [registered, setRegistered] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("id, title, slug, description, type, status, privacy, start_datetime, end_datetime, location_name, location_address, location_map_url, host_name, cover_image_url, theme_template_id, timezone, created_by, created_at, updated_at").eq("slug", slug!).single();
      return data;
    },
    enabled: !!slug,
  });

  const { data: tickets } = useQuery({
    queryKey: ["event-tickets", event?.id],
    queryFn: async () => {
      const { data } = await supabase.from("tickets").select("*").eq("event_id", event!.id).eq("is_active", true);
      return data ?? [];
    },
    enabled: !!event?.id,
  });

  const { data: sessions } = useQuery({
    queryKey: ["event-sessions", event?.id],
    queryFn: async () => {
      const { data } = await supabase.from("sessions").select("*").eq("event_id", event!.id).order("start_time");
      return data ?? [];
    },
    enabled: !!event?.id,
  });

  const { data: sponsors } = useQuery({
    queryKey: ["event-sponsors", event?.id],
    queryFn: async () => {
      const { data } = await supabase.from("sponsors").select("*").eq("event_id", event!.id);
      return data ?? [];
    },
    enabled: !!event?.id,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const selectedTicket = tickets?.find((t) => t.id === regForm.ticket_id);
      const { data, error } = await supabase.from("registrations").insert({
        event_id: event!.id,
        user_id: user?.id ?? null,
        attendee_name: regForm.name,
        attendee_email: regForm.email,
        ticket_id: regForm.ticket_id || null,
        total_paid: selectedTicket?.price ?? 0,
        payment_status: "paid" as const,
      }).select("qr_code_value").single();
      if (error) throw error;
      return data.qr_code_value;
    },
    onSuccess: (qr) => {
      setRegistered(true);
      setQrCode(qr);
      toast.success("Registration successful!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!event) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground font-body">Event not found</p></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar portal="professional" />

      {/* Hero */}
      <section className="relative h-64 md:h-80 bg-primary">
        {event.cover_image_url && <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover opacity-50" />}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground font-display">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-primary-foreground/80 text-sm font-body">
              <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" />{format(new Date(event.start_datetime), "MMM d, yyyy")}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{format(new Date(event.start_datetime), "h:mm a")}</span>
              {event.location_name && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location_name}</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {event.description && (
              <section>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">About</h2>
                <p className="text-foreground/80 font-body whitespace-pre-wrap">{event.description}</p>
              </section>
            )}

            {sessions && sessions.length > 0 && (
              <section>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">Agenda</h2>
                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground font-body">{s.title}</h3>
                          {s.speaker_name && <p className="text-sm text-muted-foreground font-body">{s.speaker_name}</p>}
                        </div>
                        <span className="text-xs text-muted-foreground font-body">
                          {format(new Date(s.start_time), "h:mm a")} – {format(new Date(s.end_time), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sponsors && sponsors.length > 0 && (
              <section>
                <h2 className="text-xl font-bold font-display text-foreground mb-3">Sponsors</h2>
                <div className="flex flex-wrap gap-4">
                  {sponsors.map((s) => (
                    <div key={s.id} className="bg-card border border-border rounded-lg p-4 text-center min-w-[120px]">
                      <p className="font-body font-semibold text-sm text-foreground">{s.name}</p>
                      <p className="text-xs text-accent font-body">{s.tier}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6 shadow-card sticky top-20">
              {registered ? (
                <div className="text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="font-display font-bold text-foreground">Registered!</h3>
                  <p className="text-sm text-muted-foreground font-body">Your QR code:</p>
                  <div className="bg-muted p-3 rounded-lg font-mono text-xs break-all">{qrCode}</div>
                </div>
              ) : showRegister ? (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-foreground">Register</h3>
                  <div>
                    <Label className="font-body">Name</Label>
                    <Input value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="font-body">Email</Label>
                    <Input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
                  </div>
                  {tickets && tickets.length > 0 && (
                    <div>
                      <Label className="font-body">Ticket</Label>
                      <Select value={regForm.ticket_id} onValueChange={(v) => setRegForm({ ...regForm, ticket_id: v })}>
                        <SelectTrigger><SelectValue placeholder="Select ticket" /></SelectTrigger>
                        <SelectContent>
                          {tickets.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} — ${t.price}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button onClick={() => registerMutation.mutate()} disabled={!regForm.name || !regForm.email || registerMutation.isPending} className="w-full font-body">
                    {registerMutation.isPending ? "Registering..." : "Complete Registration"}
                  </Button>
                </div>
              ) : (
                <>
                  {tickets && tickets.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {tickets.map((t) => (
                        <div key={t.id} className="flex justify-between text-sm font-body">
                          <span>{t.name}</span>
                          <span className="font-semibold text-primary">${t.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button onClick={() => setShowRegister(true)} className="w-full font-body" size="lg">Register Now</Button>
                  <Button variant="outline" className="w-full font-body mt-2" size="sm" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}>
                    <Share2 className="w-3.5 h-3.5 mr-2" />Share Event
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer portal="professional" />
    </div>
  );
};

export default EventDetail;
