import React from "react";
import InstructorNavbar from "@/components/InstructorNavbar";
import { BarChart2, TrendingUp, Users, BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InstructorAnalytics = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <InstructorNavbar />
      <main className="section-container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 border-none">
              Performance Analytics
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Detailed insights into your course performance and student
              engagement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Student Growth
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+24%</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                From previous month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Course Completion
              </CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                Average completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Est. Revenue
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,240</div>
              <p className="text-xs text-slate-500 mt-1">
                Projected for March 2024
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="min-h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="text-center py-12">
            <BarChart2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Detailed Analytics Coming Soon
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              We're building comprehensive visual reports to help you track
              every aspect of your teaching performance.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InstructorAnalytics;
