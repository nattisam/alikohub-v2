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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Review Teacher Application
          </h2>
          <p className="text-sm text-slate-500">
            You are about to review this candidate
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Scrollable Content Area */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Summary rows */}
          <div className="px-6 py-4 space-y-3 text-sm border-b border-border">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">
                {application.user?.firstname} {application.user?.lastname}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900">
                {application.user?.email}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-medium text-slate-900">{department}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Resume</span>
              {application.formData?.resumeUrl ? (
                <a
                  href={application.formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-semibold hover:underline bg-emerald-50 px-3 py-1 rounded-md text-xs"
                >
                  View Resume
                </a>
              ) : (
                <span className="text-slate-400">Not provided</span>
              )}
            </div>

            {application.formData?.documents &&
              application.formData.documents.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-500 block mb-2 font-medium">
                    Supporting Documents
                  </span>
                  <div className="space-y-2">
                    {application.formData.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors border border-border group"
                      >
                        <span className="text-slate-700 truncate max-w-[200px] text-xs font-medium">
                          {doc.name || `Document ${idx + 1}`}
                        </span>
                        <span className="text-emerald-600 font-bold text-[10px] uppercase group-hover:underline">
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
                  <span className="text-slate-500 block mb-2 font-medium">
                    Interview Responses
                  </span>
                  <div className="space-y-4">
                    {application.formData.interviewResponses.map((res, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm font-bold text-slate-900 mb-1">
                          {res.question}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {res.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Notes or Status - Still inside scrollable */}
          <div className="px-6 py-6 bg-slate-50/30">
            {isActionable ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Reviewer Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-28 shadow-sm transition-all"
                  placeholder="Provide internal notes or feedback for the candidate..."
                />
              </div>
            ) : (
              <div
                className={`p-6 rounded-2xl border ${
                  application.status === "ACCEPTED" ||
                  application.status === "APPROVED"
                    ? "bg-emerald-50 border-emerald-100 shadow-sm"
                    : "bg-red-50 border-red-100 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {application.status === "ACCEPTED" ||
                  application.status === "APPROVED" ? (
                    <div className="bg-emerald-500 rounded-full p-1.5 shadow-sm shadow-emerald-200">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-1.5 shadow-sm shadow-red-200">
                      <XCircle size={16} className="text-white" />
                    </div>
                  )}
                  <span
                    className={`text-lg font-bold ${
                      application.status === "ACCEPTED" ||
                      application.status === "APPROVED"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    Application {application.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium">
                  This application was processed on{" "}
                  {new Date(application.updatedAt).toLocaleDateString()}.
                </p>
                {application.reviewNotes && (
                  <div className="mt-4 p-4 bg-white/60 rounded-lg text-sm text-slate-700">
                    <p className="font-semibold text-xs text-slate-500 uppercase mb-1">
                      Notes
                    </p>
                    <p>{application.reviewNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-border text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          {isActionable && (
            <>
              <button
                onClick={() => onReject(application.id, notes)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(application.id, notes)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 disabled:opacity-50 transition-colors"
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
