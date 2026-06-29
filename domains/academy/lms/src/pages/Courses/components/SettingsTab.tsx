import React from "react";
import { Settings, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types/academy";

interface SettingsTabProps {
  course?: Course;
  onSubmitForApproval: () => void;
  isSubmitting: boolean;
}

export const SettingsTab = ({
  course,
  onSubmitForApproval,
  isSubmitting,
}: SettingsTabProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-base font-semibold text-red-600 mb-5 flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5 text-red-500" /> Danger Zone
        </h2>

        <div className="space-y-6">
          {/* Delete */}
          <div className="flex items-center justify-between gap-6 p-5 bg-red-50/60 rounded-xl border border-red-100">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-900">
                Delete Permanently
              </p>
              <p className="text-xs text-red-500">
                All course data, modules, and lessons will be lost. This action
                is irreversible and will remove access for all currently
                enrolled students.
              </p>
            </div>

            <Button
              variant="destructive"
              className="font-medium rounded-lg h-10 px-6 shrink-0 bg-red-600 hover:bg-red-700"
            >
              Delete Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
