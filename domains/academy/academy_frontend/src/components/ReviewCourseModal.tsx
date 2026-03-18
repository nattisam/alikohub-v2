import React, { useState } from "react";
import { Course } from "@/types/academy";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Review Course
          </h2>
          <p className="text-sm text-slate-500">
            You are about to review this course content
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Scrollable Content Area */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Summary rows */}
          <div className="px-6 py-4 space-y-3 text-sm border-b border-border">
            <div className="flex justify-between">
              <span className="text-slate-500">Title</span>
              <span
                className="font-medium text-slate-900 truncate max-w-[240px]"
                title={course.title}
              >
                {course.title}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Instructor</span>
              <span className="font-medium text-slate-900">
                {course.instructor
                  ? `${course.instructor.firstname} ${course.instructor.lastname}`
                  : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Category</span>
              <span className="font-medium text-slate-900">
                {course.category}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Price</span>
              <span className="font-medium text-slate-900 text-emerald-600 font-bold">
                {course.price && course.price > 0 ? `$${course.price}` : "Free"}
              </span>
            </div>
          </div>

          {/* Detailed Info / Description */}
          <div className="px-6 py-4 border-b border-border">
            <span className="text-slate-500 block mb-2 font-medium text-sm">
              Short Description
            </span>
            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-border">
              {course.shortDescription || "No description provided."}
            </p>
          </div>

          {course.thumbnail && (
            <div className="px-6 py-4 border-b border-border">
              <span className="text-slate-500 block mb-2 font-medium text-sm">
                Thumbnail
              </span>
              <div className="bg-slate-50 p-2 rounded-xl border border-border">
                <img
                  src={course.thumbnail}
                  alt="Thumbnail"
                  className="max-h-[200px] w-auto mx-auto rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Notes or Status - Still inside scrollable */}
          <div className="px-6 py-6 bg-slate-50/30">
            {isActionable ? (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Rejection Reason / Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-28 shadow-sm transition-all"
                  placeholder="Provide internal notes or feedback for the instructor (required if rejecting)..."
                />
              </div>
            ) : (
              <div
                className={`p-6 rounded-2xl border ${
                  course.status === "PUBLISHED"
                    ? "bg-emerald-50 border-emerald-100 shadow-sm"
                    : course.status === "REJECTED"
                      ? "bg-red-50 border-red-100 shadow-sm"
                      : "bg-slate-50 border-border shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {course.status === "PUBLISHED" ? (
                    <div className="bg-emerald-500 rounded-full p-1.5 shadow-sm shadow-emerald-200">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  ) : course.status === "REJECTED" ? (
                    <div className="bg-red-500 rounded-full p-1.5 shadow-sm shadow-red-200">
                      <XCircle size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-slate-400 rounded-full p-1.5 shadow-sm shadow-slate-200">
                      <BookOpen size={16} className="text-white" />
                    </div>
                  )}
                  <span
                    className={`text-lg font-bold ${
                      course.status === "PUBLISHED"
                        ? "text-emerald-700"
                        : course.status === "REJECTED"
                          ? "text-red-700"
                          : "text-slate-600"
                    }`}
                  >
                    Course {course.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium">
                  {course.status === "DRAFT"
                    ? "This course is currently in draft and has not been submitted yet."
                    : `This course was processed on ${new Date(course.updatedAt).toLocaleDateString()}.`}
                </p>
                {/* Note: if backend is updated we can add rejection notes here */}
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
                onClick={() => onReject(course.id, notes)}
                disabled={isProcessing}
                className="px-5 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(course.id, notes)}
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

export default ReviewCourseModal;
