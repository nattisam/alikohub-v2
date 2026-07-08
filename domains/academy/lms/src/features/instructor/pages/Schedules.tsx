import React from "react";
import InstructorLayout from "@/features/instructor/components/InstructorLayout";
import { Calendar, Clock, BellRing, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InstructorSchedules = () => {
  return (
    <InstructorLayout>
      <main className="section-container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 border-none">
              Course Schedules
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your live sessions, cohorts, and upcoming deadlines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                  <Calendar className="w-16 h-16 text-slate-200 mb-4" />
                  <p className="font-medium text-slate-600">
                    No scheduled events found
                  </p>
                  <p className="text-sm">
                    When you create live sessions or cohorts, they will appear
                    here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 text-sm animate-in fade-in slide-in-from-right duration-500">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">
                      System Update
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Live streaming features will be available next week.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="font-bold">Pro Tip</span>
                </div>
                <p className="text-sm text-slate-400">
                  Scheduling regular live sessions increases student engagement
                  by up to 40%!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </InstructorLayout>
  );
};

export default InstructorSchedules;
