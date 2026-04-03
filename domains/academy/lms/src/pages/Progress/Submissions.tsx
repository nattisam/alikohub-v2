import React, { useState } from "react";
import InstructorNavbar from "@/components/InstructorNavbar";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ChevronRight,
  X,
  Star,
  Search,
  Users,
} from "lucide-react";
import {
  useInstructorSubmissions,
  useGradeSubmission,
} from "@/hooks/useAcademy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const InstructorSubmissions = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(
    null,
  );
  const [gradingForm, setGradingForm] = useState({
    score: 0,
    feedback: "",
    isCorrect: true,
  });

  const { data: submissionsData, isLoading } = useInstructorSubmissions({
    page,
    pageSize: 10,
    status: filter === "ALL" ? undefined : filter,
  });

  const gradeMutation = useGradeSubmission();

  const submissions = submissionsData?.items ?? [];
  const totalSubmissions = submissionsData?.total ?? 0;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openGradeModal = (sub: any) => {
    setSelectedSubmission(sub);
    setGradingForm({
      score: sub.score ?? 0,
      feedback: sub.feedback ?? "",
      isCorrect: sub.isCorrect ?? true,
    });
  };

  const submitGrade = () => {
    if (!selectedSubmission) return;
    gradeMutation.mutate(
      { submissionId: selectedSubmission.id, data: gradingForm },
      {
        onSuccess: () => {
          setSelectedSubmission(null);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      <InstructorNavbar />

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Student Submissions
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Review and grade student exercise work across all your courses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {["ALL", "PENDING", "GRADED"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setFilter(s);
                    setPage(1);
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    filter === s
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Content ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] font-bold py-5 pl-8">
                    Student
                  </TableHead>
                  <TableHead className="font-bold py-5">Exercise</TableHead>
                  <TableHead className="font-bold py-5">Course</TableHead>
                  <TableHead className="font-bold py-5">Status</TableHead>
                  <TableHead className="font-bold py-5">Score</TableHead>
                  <TableHead className="font-bold py-5">Date</TableHead>
                  <TableHead className="font-bold py-5 text-right pr-8">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-slate-100 animate-pulse rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-12 w-12 text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">
                          No submissions found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((sub: any) => (
                    <TableRow
                      key={sub.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {sub.user.firstname[0]}
                            {sub.user.lastname[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">
                              {sub.user.firstname} {sub.user.lastname}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {sub.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">
                            {sub.exercise.title}
                          </span>
                          <Badge
                            variant="outline"
                            className="w-fit text-[10px] h-5 mt-1 border-slate-200 bg-slate-50/50"
                          >
                            {sub.exercise.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-500">
                          {sub.exercise.module.course.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-black text-[10px] tracking-widest px-3 py-1 rounded-full border-none",
                            sub.status === "PENDING"
                              ? "bg-amber-50 text-amber-600"
                              : sub.status === "GRADED"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-50 text-slate-500",
                          )}
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-slate-900">
                            {sub.score}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">
                            / {sub.exercise.points}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          {format(new Date(sub.createdAt), "MMM d, HH:mm")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button
                          onClick={() => openGradeModal(sub)}
                          className={cn(
                            "rounded-xl h-9 px-4 font-bold text-xs transition-all active:scale-95 shadow-sm",
                            sub.status === "PENDING"
                              ? "bg-slate-900 hover:bg-black text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
                          )}
                        >
                          {sub.status === "PENDING" ? "Grade" : "Edit Grade"}
                          <ChevronRight size={14} className="ml-1 opacity-50" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && totalSubmissions > 10 && (
            <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
              <span className="text-xs font-semibold text-slate-400">
                Showing {submissions.length} of {totalSubmissions} submissions
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg font-bold h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={submissions.length < 10}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg font-bold h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Grading Modal ── */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bg-slate-900 p-6 text-white relative shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <Badge className="bg-primary/20 text-accent border-none font-black text-[10px] tracking-[0.2em] mb-4">
                  MANUAL GRADING
                </Badge>
                <DialogTitle className="text-2xl font-bold font-heading mb-2">
                  Grade Exercise
                </DialogTitle>
                <div className="flex items-center gap-2 text-slate-400 flex-wrap">
                  <Users size={15} />
                  <span className="text-sm font-bold text-slate-200">
                    {selectedSubmission?.user?.firstname}{" "}
                    {selectedSubmission?.user?.lastname}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-700 mx-1" />
                  <span className="text-sm font-medium">
                    {selectedSubmission?.exercise?.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="py-6 pl-6 pr-4 mr-1 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            {/* Student's Answer */}
            <div>
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 block">
                Student's Answer
              </label>
              <p className="text-slate-900 font-bold text-lg bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                {selectedSubmission?.answer}
              </p>
              {selectedSubmission?.exercise?.correctAnswer && (
                <p className="mt-3 text-xs font-bold text-emerald-600 pl-1">
                  Correct Answer: {selectedSubmission.exercise.correctAnswer}
                </p>
              )}
            </div>

            {/* Grading controls */}
            <div className="grid grid-cols-2 gap-4">
              {/* Score */}
              <div>
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 block">
                  Score (Max {selectedSubmission?.exercise?.points})
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={selectedSubmission?.exercise?.points}
                    value={gradingForm.score}
                    onChange={(e) =>
                      setGradingForm({
                        ...gradingForm,
                        score: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-12 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-primary pl-4 text-xl font-black"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    Pts
                  </div>
                </div>
              </div>

              {/* Correctness */}
              <div>
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 block">
                  Verdict
                </label>
                <div className="flex gap-2 h-12">
                  <button
                    onClick={() =>
                      setGradingForm({ ...gradingForm, isCorrect: true })
                    }
                    className={cn(
                      "flex-1 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all text-sm",
                      gradingForm.isCorrect
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-100 shadow-sm"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    <CheckCircle size={16} /> Correct
                  </button>
                  <button
                    onClick={() =>
                      setGradingForm({ ...gradingForm, isCorrect: false })
                    }
                    className={cn(
                      "flex-1 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all text-sm",
                      gradingForm.isCorrect === false
                        ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-100 shadow-sm"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    <AlertCircle size={16} /> Incorrect
                  </button>
                </div>
              </div>

              {/* Feedback */}
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 block">
                  Feedback & Comments
                </label>
                <Textarea
                  value={gradingForm.feedback}
                  onChange={(e) =>
                    setGradingForm({ ...gradingForm, feedback: e.target.value })
                  }
                  placeholder="Tell the student what they did well or how to improve…"
                  className="min-h-[100px] rounded-xl border-slate-200 bg-white p-4 shadow-sm resize-none focus:ring-primary font-medium"
                />
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2 flex justify-end gap-3 shrink-0">
            <Button
              variant="ghost"
              onClick={() => setSelectedSubmission(null)}
              className="h-10 px-6 rounded-lg font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={submitGrade}
              disabled={gradeMutation.isPending}
              className="h-10 px-8 rounded-lg bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 active:scale-95 transition-all gap-2"
            >
              {gradeMutation.isPending ? "Saving…" : "Apply Grade"}
              <Star size={14} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default InstructorSubmissions;
