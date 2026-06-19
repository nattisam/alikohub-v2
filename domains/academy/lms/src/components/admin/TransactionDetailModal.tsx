import React from "react";
import {
  X,
  CreditCard,
  User,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionDetailModalProps {
  transaction: any;
  userMap: Record<string, string>;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  userMap,
  onClose,
}) => {
  if (!transaction) return null;

  const meta = transaction.metadata as any;
  const courseTitle =
    meta?.courseTitle ||
    meta?.courseName ||
    (meta?.courseId ? `Course #${meta.courseId}` : "—");

  const username =
    userMap[transaction.userId] ||
    transaction.user?.email ||
    transaction.userId?.substring(0, 8) ||
    "—";

  const date = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#27272a] w-full max-w-lg rounded-2xl border border-[#3f3f46] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#3f3f46]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#3f3f46] border border-[#52525b]">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Transaction Info
              </h2>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                  getStatusStyles(transaction.status),
                )}
              >
                {transaction.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#3f3f46] text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#18181b] p-3 rounded-xl border border-[#3f3f46]">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                Amount
              </p>
              <p className="text-lg font-bold text-white">
                {transaction.currency || "USD"}{" "}
                {Number(transaction.amount).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#18181b] p-3 rounded-xl border border-[#3f3f46]">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                Date
              </p>
              <p className="text-sm font-semibold text-zinc-300">{date}</p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400 font-medium">
                  Customer
                </span>
              </div>
              <span className="text-sm font-semibold text-white text-right">
                {username}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400 font-medium">
                  Course
                </span>
              </div>
              <span
                className="text-sm font-semibold text-white text-right max-w-[200px] truncate"
                title={courseTitle}
              >
                {courseTitle}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400 font-medium">
                  Provider
                </span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                  transaction.provider === "CHAPA" &&
                    "bg-green-500/10 text-green-400 border-green-500/20",
                  transaction.provider === "STRIPE" &&
                    "bg-violet-500/10 text-violet-400 border-violet-500/20",
                  !transaction.provider &&
                    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
                )}
              >
                {transaction.provider || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-400 font-medium">
                  Ref ID
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {transaction.id}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#1f1f22] flex justify-end gap-3 border-t border-[#3f3f46]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#52525b] text-zinc-300 text-xs font-bold hover:bg-[#3f3f46] transition-colors"
          >
            Close
          </button>

          {transaction.checkoutUrl && transaction.status === "PENDING" && (
            <a
              href={transaction.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              <ExternalLink className="w-4 h-4" />
              Resume
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
