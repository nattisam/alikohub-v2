import { Mail, Send, Bell } from "lucide-react";
import { motion } from "framer-motion";

const AdminMessaging = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display text-foreground">Messaging</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Send communications to your attendees and guests</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/60 rounded-2xl p-12 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-sky to-teal flex items-center justify-center shadow-md">
          <Mail className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="font-display font-bold text-foreground text-lg mb-2">Coming Soon</h2>
        <p className="text-muted-foreground font-body text-sm max-w-md mx-auto mb-6">
          Send registration confirmations, event invites, and reminders to attendees and guests via email and SMS.
        </p>
        <div className="flex items-center justify-center gap-6 text-muted-foreground/60">
          <div className="flex items-center gap-2 text-xs font-body">
            <Send className="w-4 h-4" /> Email Blasts
          </div>
          <div className="flex items-center gap-2 text-xs font-body">
            <Bell className="w-4 h-4" /> Reminders
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminMessaging;
