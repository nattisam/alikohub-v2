import { useState } from "react";
import { Bell, X, Sparkles } from "lucide-react";
import { useNotificationFCM } from "@/components/shared/NotificationFCMProvider";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A compact, dismissible banner that prompts the user to enable push notifications.
 * Only renders when notification permission is still "default" (not yet decided).
 */
const NotificationPromptBanner = () => {
  const { permissionStatus, requestPermission } = useNotificationFCM();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Don't render if already decided or unsupported
  if (permissionStatus !== "default" || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    setLoading(true);
    await requestPermission();
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg shadow-purple-200/30 overflow-hidden"
        id="notification-prompt-banner"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-white rounded-full translate-y-1/2" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Stay in the loop!
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              Enable push notifications for announcements, new courses & cohort
              updates.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleEnable}
              disabled={loading}
              className="h-8 bg-white text-indigo-600 hover:bg-white/90 text-xs font-bold shadow-lg border-0"
              id="enable-notifications-btn"
            >
              {loading ? "Enabling..." : "Enable"}
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPromptBanner;
