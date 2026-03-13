import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Trash2, Mail } from "lucide-react";

type Contact = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      const { data } = await api.get("/consultancy/contacts");
      setContacts(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to fetch contacts.", variant: "destructive" });
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const markRead = async (c: Contact) => {
    if (!c.isRead) {
      try {
        await api.patch(`/consultancy/contacts/${c.id}`, { isRead: true });
        fetchContacts();
      } catch (e) {
        console.error("Failed to mark as read");
      }
    }
    setSelected(c);
  };

  const deleteContact = async (id: string) => {
    try {
      await api.delete(`/consultancy/contacts/${id}`);
      toast({ title: "Message Deleted" });
      setSelected(null);
      fetchContacts();
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to delete message.", variant: "destructive" });
    }
  };

  const filtered = contacts.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary mb-1">Contact Messages</h1>
        <p className="text-muted-foreground text-sm">View and manage contact form submissions.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground w-8"></th>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Subject</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={`border-t border-border hover:bg-muted/20 ${!c.isRead ? "font-medium" : ""}`}>
                  <td className="p-3">{!c.isRead && <div className="w-2 h-2 rounded-full bg-accent" />}</td>
                  <td className="p-3">{c.fullName}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.subject}</td>
                  <td className="p-3 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right flex gap-1 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => markRead(c)}><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteContact(c.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No messages found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">From:</span> {selected.fullName}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selected.phone || "N/A"}</div>
                <div><span className="text-muted-foreground">Date:</span> {new Date(selected.createdAt).toLocaleString()}</div>
              </div>
              <div><span className="text-muted-foreground">Subject:</span> <span className="font-semibold">{selected.subject}</span></div>
              <div className="bg-muted/30 rounded-lg p-4"><p>{selected.message}</p></div>
              <a href={`mailto:${selected.email}`}>
                <Button className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold">
                  <Mail className="w-4 h-4 mr-2" /> Reply via Email
                </Button>
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContacts;
