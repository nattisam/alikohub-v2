import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import api from "@/lib/api";

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];

const parseTime = (t: string) => {
  const [time, period] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
};

const BookConsultation = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [pillar, setPillar] = useState(searchParams.get("pillar") || "");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [booked, setBooked] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const { toast } = useToast();

  const mapPillar = (p: string): "BUSINESS" | "CAREER" | "TRAVEL" => {
    if (p === "student") return "TRAVEL";
    return p.toUpperCase() as any;
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setLoading(true);

    const startTime = parseTime(time);
    const [h, m] = startTime.split(":").map(Number);
    const endH = m + 30 >= 60 ? h + 1 : h;
    const endM = (m + 30) % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || null,
        consultationType: mapPillar(pillar),
        bookingDate: new Date(date.setHours(12, 0, 0, 0)).toISOString(),
        startTime: `1970-01-01T${startTime}.000Z`,
        endTime: `1970-01-01T${endTime}.000Z`,
        notes: form.notes || null,
      };

      const { data } = await api.post("/consultancy/bookings", payload);
      setBookingCode(data.bookingCode || "");
      setBooked(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to book consultation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="section-padding">
        <div className="container-narrow text-center">
          <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold text-primary mb-4">
            Consultation Booked!
          </h1>
          <p className="text-muted-foreground mb-8">
            You will receive a confirmation email with all the details shortly.
          </p>
          <Link to="/">
            <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-navy section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold mb-4 block">
              Book a Consultation
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Schedule Your Session
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Choose your service, pick a time, and we'll take care of the rest.
            </p>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-narrow">
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    step >= s
                      ? "bg-gold text-navy"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "w-12 h-0.5",
                      step > s ? "bg-gold" : "bg-border",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-bold text-primary text-center mb-6">
                Select Your Service
              </h2>
              <Select value={pillar} onValueChange={setPillar}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Consulting</SelectItem>
                  <SelectItem value="career">
                    Career Guidance & Mentorship
                  </SelectItem>
                  <SelectItem value="travel">Travel Advisory</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => pillar && setStep(2)}
                disabled={!pillar}
                className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold py-5"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-primary text-center mb-6">
                Choose Date & Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) =>
                      d < new Date() || d.getDay() === 0 || d.getDay() === 6
                    }
                    className="rounded-xl border border-border pointer-events-auto p-3"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-primary mb-4">
                    {date
                      ? `Available slots for ${format(date, "MMMM d, yyyy")}`
                      : "Select a date to see available times"}
                  </h3>
                  {date && (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setTime(slot)}
                          className={cn(
                            "px-4 py-2.5 text-sm rounded-lg border transition-colors",
                            time === slot
                              ? "bg-gold text-navy border-gold font-semibold"
                              : "border-border hover:border-accent text-foreground",
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => date && time && setStep(3)}
                  disabled={!date || !time}
                  className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleBook} className="space-y-5 max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-bold text-primary text-center mb-6">
                Your Details
              </h2>
              <Input
                placeholder="Full Name"
                required
                className="bg-card"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email Address"
                required
                className="bg-card"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                placeholder="Phone (optional)"
                className="bg-card"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Textarea
                placeholder="Anything you'd like us to know?"
                rows={3}
                className="bg-card"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <div className="bg-off-white rounded-lg p-4 text-sm space-y-1">
                <p>
                  <span className="font-semibold">Service:</span> {pillar}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {date && format(date, "MMMM d, yyyy")}
                </p>
                <p>
                  <span className="font-semibold">Time:</span> {time}
                </p>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gold text-navy hover:bg-gold/90 font-semibold"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookConsultation;
