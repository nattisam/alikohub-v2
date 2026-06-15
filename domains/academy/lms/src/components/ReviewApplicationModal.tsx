import React, { useState } from "react";
import type { TeacherApplication } from "@/types/academy";
import { CheckCircle, XCircle } from "lucide-react";

interface ReviewModalProps {
  application: TeacherApplication | null;
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
  isProcessing: boolean;
}

const ReviewApplicationModal: React.FC<ReviewModalProps> = ({
  application,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [notes, setNotes] = useState("");

  if (!application) return null;

  const department =
    application.formData?.teachingCategories &&
    application.formData.teachingCategories.length > 0
      ? application.formData.teachingCategories.join(", ")
      : "General";

  const isActionable =
    application.status === "PENDING" || application.status === "SUBMITTED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#27272a] w-full max-w-lg rounded-2xl border border-[#3f3f46] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-white">
            Review teacher application
          </h2>
          <p className="text-sm text-zinc-400">
            You are about to review this candidate
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3f3f46]" />

        {/* Scrollable Content Area */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Summary rows */}
          <div className="px-6 py-4 space-y-3 text-sm border-b border-[#3f3f46]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Name</span>
              <span className="font-medium text-white">
                {application.user?.firstname} {application.user?.lastname}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Email</span>
              <span className="font-medium text-white">
                {application.user?.email}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Department</span>
              <span className="font-medium text-white">{department}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-zinc-400">Resume</span>
              {application.formData?.resumeUrl ? (
                <a
                  href={application.formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md text-xs"
                >
                  View resume
                </a>
              ) : (
                <span className="text-zinc-500">Not provided</span>
              )}
            </div>

            {application.formData?.documents &&
              application.formData.documents.length > 0 && (
                <div className="pt-2">
                  <span className="text-zinc-400 block mb-2 font-medium">
                    Supporting documents
                  </span>
                  <div className="space-y-2">
                    {application.formData.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-[#3f3f46] p-3 rounded-xl hover:bg-[#52525b] transition-colors border border-[#52525b] group"
                      >
                        <span className="text-zinc-300 truncate max-w-[200px] text-xs font-medium">
                          {doc.name || `Document ${idx + 1}`}
                        </span>
                        <span className="text-emerald-400 font-bold text-[10px] uppercase group-hover:underline">
                          View
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            {application.formData?.interviewResponses &&
              application.formData.interviewResponses.length > 0 && (
                <div className="pt-2">
                  <span className="text-zinc-400 block mb-2 font-medium">
                    Interview responses
                  </span>
                  <div className="space-y-4">
                    {application.formData.interviewResponses.map((res, i) => (
                      <div key={i} className="bg-[#3f3f46] p-4 rounded-lg border border-[#52525b]">
                        <p className="text-sm font-bold text-white mb-1">
                          {res.question}
                        </p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {res.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Notes or Status */}
          <div className="px-6 py-6">
            {isActionable ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Reviewer notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#3f3f46] rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none resize-none h-28 transition-all"
                  placeholder="Provide internal notes or feedback for the candidate..."
                />
              </div>
            ) : (
              <div
                className={`p-6 rounded-2xl border ${
                  application.status === "ACCEPTED" ||
                  application.status === "APPROVED"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {application.status === "ACCEPTED" ||
                  application.status === "APPROVED" ? (
                    <div className="bg-emerald-500 rounded-full p-1.5">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-1.5">
                      <XCircle size={16} className="text-white" />
                    </div>
                  )}
                  <span
                    className={`text-lg font-bold ${
                      application.status === "ACCEPTED" ||
                      application.status === "APPROVED"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    Application {application.status}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm font-medium">
                  This application was processed on{" "}
                  {new Date(application.updatedAt).toLocaleDateString()}.
                </p>
                {application.reviewNotes && (
                  <div className="mt-4 p-4 bg-[#18181b] rounded-lg text-sm text-zinc-300 border border-[#3f3f46]">
                    <p className="font-semibold text-xs text-zinc-500 uppercase mb-1">
                      Notes
                    </p>
                    <p>{application.reviewNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#1f1f22] flex justify-end gap-3 border-t border-[#3f3f46]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#52525b] text-zinc-300 text-sm font-bold hover:bg-[#3f3f46] transition-colors"
          >
            Close
          </button>

          {isActionable && (
            <>
              <button
                onClick={() => onReject(application.id, notes)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(application.id, notes)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewApplicationModal;
