import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTeacherApplications, useApproveTeacher } from "@/hooks/useAcademy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/AdminLayout";

const TeacherApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: applications } = useTeacherApplications();
  const app = applications?.find((a: any) => a.id === id) as any;
  const approveMutation = useApproveTeacher();

  const [reviewNotes, setReviewNotes] = useState("");

  if (!app) {
    return (
      <AdminLayout title="Application Not Found">
        <div className="text-center py-12">
          <p>Application not found.</p>
          <Button asChild className="mt-4">
            <Link to="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleApprove = () => {
    approveMutation.mutate(
      { appId: app.id, reviewNotes },
      {
        onSuccess: () => navigate("/admin"),
      },
    );
  };

  return (
    <AdminLayout title="Application Details">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                app.status === "PENDING"
                  ? "bg-amber-100 text-amber-600"
                  : app.status === "ACCEPTED"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
              }`}
            >
              {app.status} Status
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      First Name
                    </p>
                    <p className="text-slate-900 font-medium">
                      {app.personalDetails.firstname}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">
                      Last Name
                    </p>
                    <p className="text-slate-900 font-medium">
                      {app.personalDetails.lastname}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3BC1A8]" />
                    <span className="text-sm text-slate-600">
                      {app.personalDetails.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#3BC1A8]" />
                    <span className="text-sm text-slate-600">
                      {app.personalDetails.phone}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                    Teaching Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.teachingCategories.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-[#3BC1A8]/10 text-[#005461] font-bold rounded-lg text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                    Resume / Portofolio
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2 font-bold border-[#3BC1A8] text-[#005461] hover:bg-[#3BC1A8]/5"
                    asChild
                  >
                    <a
                      href={
                        app.resumeUrl
                          ? app.resumeUrl.replace(
                              "http://localhost:3009",
                              "https://api.consultancy.alikohub.com",
                            )
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="w-4 h-4" /> View Document{" "}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">
                    Interview Responses
                  </p>
                  <div className="space-y-4">
                    {app.interviewResponses.map((res: any, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-100"
                      >
                        <p className="text-sm font-bold text-slate-900 mb-2">
                          {res.question}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {res.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="sticky top-[100px] border-none shadow-md">
              <CardHeader className="bg-[#005461] rounded-t-xl py-4">
                <CardTitle className="text-lg text-center text-white">
                  Review Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Review Notes
                  </label>
                  <Textarea
                    placeholder="Add notes for the applicant..."
                    className="min-h-[120px] resize-none rounded-xl"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full gap-2 bg-[#3BC1A8] hover:bg-[#2fa38d] text-white font-bold"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="w-4 h-4" /> Approve Applicant
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 font-bold"
                  >
                    <XCircle className="w-4 h-4" /> Reject Applicant
                  </Button>
                </div>
                <div className="pt-4 border-t text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 font-bold">
                    <Calendar className="w-3 h-3 text-[#3BC1A8]" /> Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeacherApplicationDetail;
