import React, { useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTeacherApplications, useApproveTeacher } from "@/hooks/useAcademy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const TeacherApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: applications } = useTeacherApplications();
  const app = applications?.find((a) => a.id === id);
  const approveMutation = useApproveTeacher();

  const [reviewNotes, setReviewNotes] = useState("");

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />
        <div className="section-container py-12 text-center">
          <p>Application not found.</p>
          <Button asChild className="mt-4">
            <Link to="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
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
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />

      <main className="section-container py-8 md:py-12 max-w-4xl mx-auto">
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
            <Card>
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
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {app.personalDetails.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {app.personalDetails.phone}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
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
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm"
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
                  <Button variant="outline" className="gap-2" asChild>
                    <a
                      href={app.resumeUrl}
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
                    {app.interviewResponses.map((res, i) => (
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="sticky top-[100px]">
              <CardHeader>
                <CardTitle className="text-lg text-center">
                  Take Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Review Notes
                  </label>
                  <Textarea
                    placeholder="Add notes for the applicant..."
                    className="min-h-[120px] resize-none"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
                <div className="pt-2 space-y-2">
                  <Button
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="w-4 h-4" /> Approve Applicant
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject Applicant
                  </Button>
                </div>
                <div className="pt-4 border-t text-center">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" /> Applied on{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherApplicationDetail;
