import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye } from "lucide-react";

type Booking = {
  id: string;
  bookingCode: string;
  fullName: string;
  email: string;
  phone: string | null;
  consultationType: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  status: string;
  adminNotes: string | null;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/consultancy/bookings");
      setBookings(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to fetch bookings.", variant: "destructive" });
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateBooking = async () => {
    if (!selected) return;
    try {
      await api.patch(`/consultancy/bookings/${selected.id}`, {
        status: newStatus,
        adminNotes: adminNotes,
      });
      toast({ title: "Booking Updated" });
      setSelected(null);
      fetchBookings();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update.", variant: "destructive" });
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch = 
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || b.status === statusFilter.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary mb-1">Bookings</h1>
        <p className="text-muted-foreground text-sm">Manage consultation bookings.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, code, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Time</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/20">
                  <td className="p-3 font-mono text-xs">{b.bookingCode}</td>
                  <td className="p-3">{b.fullName}</td>
                  <td className="p-3 capitalize">{b.consultationType}</td>
                  <td className="p-3">{b.bookingDate}</td>
                  <td className="p-3">{b.startTime}</td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-muted text-muted-foreground"
                    }`}>{b.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => { setSelected(b); setAdminNotes(b.adminNotes || ""); setNewStatus(b.status); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Code:</span> <span className="font-mono">{selected.bookingCode}</span></div>
                <div><span className="text-muted-foreground">Name:</span> {selected.fullName}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selected.phone || "N/A"}</div>
                <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{selected.consultationType}</span></div>
                <div><span className="text-muted-foreground">Date:</span> {selected.bookingDate}</div>
                <div><span className="text-muted-foreground">Time:</span> {selected.startTime} - {selected.endTime}</div>
              </div>
              {selected.notes && (
                <div><span className="text-sm text-muted-foreground">Client Notes:</span><p className="text-sm mt-1">{selected.notes}</p></div>
              )}
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue placeholder="Update status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="NO_SHOW">No Show</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Admin notes..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
              <Button onClick={updateBooking} className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
