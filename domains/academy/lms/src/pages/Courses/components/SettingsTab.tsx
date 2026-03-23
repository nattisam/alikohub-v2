import React from "react";
import { Settings, AlertCircle } from "lucide-react";
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
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-500" /> Danger Zone
        </h2>

        <div className="space-y-6">
          {/* Delete */}
          <div className="flex items-center justify-between p-6 bg-red-50/50 rounded-2xl border border-red-100">
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-900">
                Delete Permanently
              </p>
              <p className="text-xs text-red-500 font-medium">
                All course data, modules, and lessons will be lost.
              </p>
            </div>

            <Button
              variant="destructive"
              className="font-bold rounded-xl h-11 px-8"
            >
              Delete Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
