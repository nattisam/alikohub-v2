import React, { useState } from "react";
import type { Course } from "@/types/academy";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";

interface ReviewCourseModalProps {
  course: Course | null;
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
  isProcessing: boolean;
}

const ReviewCourseModal: React.FC<ReviewCourseModalProps> = ({
  course,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [notes, setNotes] = useState("");

  if (!course) return null;

  const isActionable =
    course.status === "PENDING" ||
    course.status === "PENDING_APPROVAL" ||
    course.status === "DRAFT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#27272a] w-full max-w-lg rounded-2xl border border-[#3f3f46] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-white">
            Review course
          </h2>
          <p className="text-sm text-zinc-400">
            You are about to review this course content
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3f3f46]" />

        {/* Scrollable Content Area */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Summary rows */}
          <div className="px-6 py-4 space-y-3 text-sm border-b border-[#3f3f46]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Title</span>
              <span
                className="font-medium text-white truncate max-w-[240px]"
                title={course.title}
              >
                {course.title}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Instructor</span>
              <span className="font-medium text-white">
                {course.instructor
                  ? `${course.instructor.firstname} ${course.instructor.lastname}`
                  : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Category</span>
              <span className="font-medium text-white">
                {course.category}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Price</span>
              <span className="font-bold text-emerald-400">
                {course.price && course.price > 0 ? `$${course.price}` : "Free"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-4 border-b border-[#3f3f46]">
            <span className="text-zinc-400 block mb-2 font-medium text-sm">
              Short description
            </span>
            <p className="text-sm text-zinc-300 leading-relaxed bg-[#3f3f46] p-4 rounded-xl border border-[#52525b]">
              {course.shortDescription || "No description provided."}
            </p>
          </div>

          {course.thumbnail && (
            <div className="px-6 py-4 border-b border-[#3f3f46]">
              <span className="text-zinc-400 block mb-2 font-medium text-sm">
                Thumbnail
              </span>
              <div className="bg-[#3f3f46] p-2 rounded-xl border border-[#52525b]">
                <img
                  src={course.thumbnail}
                  alt="Thumbnail"
                  className="max-h-[200px] w-auto mx-auto rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Notes or Status */}
          <div className="px-6 py-6">
            {isActionable ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Rejection reason / notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#18181b] border border-[#3f3f46] rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none resize-none h-28 transition-all"
                  placeholder="Provide internal notes or feedback for the instructor (required if rejecting)..."
                />
              </div>
            ) : (
              <div
                className={`p-6 rounded-2xl border ${
                  course.status === "PUBLISHED"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : course.status === "REJECTED"
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-[#3f3f46] border-[#52525b]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {course.status === "PUBLISHED" ? (
                    <div className="bg-emerald-500 rounded-full p-1.5">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  ) : course.status === "REJECTED" ? (
                    <div className="bg-red-500 rounded-full p-1.5">
                      <XCircle size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-zinc-500 rounded-full p-1.5">
                      <BookOpen size={16} className="text-white" />
                    </div>
                  )}
                  <span
                    className={`text-lg font-bold ${
                      course.status === "PUBLISHED"
                        ? "text-emerald-400"
                        : course.status === "REJECTED"
                          ? "text-red-400"
                          : "text-zinc-300"
                    }`}
                  >
                    Course {course.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm font-medium">
                  {course.status === "DRAFT"
                    ? "This course is currently in draft and has not been submitted yet."
                    : `This course was processed on ${new Date(course.updatedAt).toLocaleDateString()}.`}
                </p>
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
                onClick={() => onReject(course.id, notes)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(course.id, notes)}
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

export default ReviewCourseModal;
