import React from "react";
import { Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/academy";

interface SettingsTabProps {
  course?: Course;
  onSubmitForApproval: () => void;
  isSubmitting: boolean;
}

export const SettingsTab = ({ course, onSubmitForApproval, isSubmitting }: SettingsTabProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent" /> Course Management
        </h2>
        <div className="space-y-6">
          {/* Submit for Approval - Only show for DRAFT courses */}
          {course?.status === 'DRAFT' && (
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  Submit for Approval
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Ready to go live? Our team will review your course.
                </p>
              </div>
              <Button 
                onClick={onSubmitForApproval}
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-600 font-bold"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}

          {/* Course Rejected Notice - Show for REJECTED courses */}
          {course?.status === 'REJECTED' && (
            <div className="flex items-center gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-bold text-red-900">
                  Course Was Rejected
                </p>
                <p className="text-xs text-red-600 font-medium">
                  Your course did not pass our review process. Please make the necessary improvements and resubmit.
                </p>
              </div>
            </div>
          )}

          {/* Resubmit for Approval - Show for REJECTED courses */}
          {course?.status === 'REJECTED' && (
            <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-900">
                  Resubmit for Approval
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  Have you addressed the feedback? Submit your course again for review.
                </p>
              </div>
              <Button 
                onClick={onSubmitForApproval}
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-600 font-bold"
              >
                {isSubmitting ? "Submitting..." : "Resubmit"}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border border-red-100">
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-900">
                Delete Permanently
              </p>
              <p className="text-xs text-red-500 font-medium">
                This action cannot be undone. All data will be lost.
              </p>
            </div>
            <Button variant="destructive" className="font-bold">
              Delete Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
