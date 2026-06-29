import React, { useMemo, useState } from "react";
import InstructorLayout from "@/components/InstructorLayout";
import {
  CheckCircle2,
  X,
  Inbox,
  Search,
  ArrowUpDown,
  MoreVertical,
  Mail,
  ClipboardCheck,
  Hourglass,
  ListChecks,
} from "lucide-react";
import {
  useInstructorSubmissions,
  useGradeSubmission,
} from "@/hooks/useAcademy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ── Helpers ──────────────────────────────────────────────────────────────
const cleanTitle = (raw: string | undefined | null) => {
  if (!raw) return "";
  return raw.split("|||")[0].trim();
};

const initialsOf = (firstname?: string, lastname?: string) =>
  `${firstname?.[0] ?? ""}${lastname?.[0] ?? ""}`.toUpperCase();

const AVATAR_PALETTES = [
  "bg-indigo-50 text-indigo-600",
  "bg-rose-50 text-rose-600",
  "bg-amber-50 text-amber-600",
  "bg-emerald-50 text-emerald-600",
  "bg-sky-50 text-sky-600",
  "bg-violet-50 text-violet-600",
];
const avatarPalette = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++)
    hash = (hash + key.charCodeAt(i)) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[hash];
};

const InstructorSubmissions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(
    null,
  );
  const [gradingForm, setGradingForm] = useState({
    score: 0,
    feedback: "",
    isCorrect: true,
  });

  const { data: submissionsData, isLoading } = useInstructorSubmissions({
    page: 1,
    pageSize: 300,
    status: statusFilter === "ALL" ? undefined : (statusFilter as any),
  });

  const gradeMutation = useGradeSubmission();
  const rawSubmissions = submissionsData?.items ?? [];

  // ── Flatten & Group for Table View ─────────────────────────────────────
  const groupedSubmissions = useMemo(() => {
    const groups: Record<string, any> = {};

    rawSubmissions.forEach((sub: any) => {
      const quizId = sub.exercise?.lessonId || sub.exercise?.id;
      const key = `${sub.userId}-${quizId}`;

      if (!groups[key]) {
        groups[key] = {
          id: key,
          userId: sub.userId,
          user: sub.user,
          quizId,
          quizTitle:
            sub.exercise?.lesson?.title || cleanTitle(sub.exercise?.title),
          courseTitle: sub.exercise?.module?.course?.title,
          courseId: sub.exercise?.module?.course?.id,
          submissions: [],
          totalScore: 0,
          maxPoints: 0,
          status: "GRADED",
          createdAt: sub.createdAt,
          gradedAt: sub.status === "GRADED" ? sub.updatedAt : null,
        };
      }

      const g = groups[key];
      g.submissions.push(sub);
      g.totalScore += sub.score ?? 0;
      g.maxPoints += sub.exercise?.points ?? 0;

      if (sub.status === "PENDING") {
        g.status = "PENDING";
      }

      if (
        sub.status === "GRADED" &&
        (!g.gradedAt || new Date(sub.updatedAt) > new Date(g.gradedAt))
      ) {
        g.gradedAt = sub.updatedAt;
      }
    });

    return Object.values(groups)
      .filter((g: any) => {
        const fullName =
          `${g.user?.firstname} ${g.user?.lastname}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchQuery.toLowerCase()) ||
          g.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.quizTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse =
          courseFilter === "ALL" || g.courseId?.toString() === courseFilter;
        return matchesSearch && matchesCourse;
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [rawSubmissions, searchQuery, courseFilter]);

  // Unique courses for filter
  const uniqueCourses = useMemo(() => {
    const courses = new Map();
    rawSubmissions.forEach((sub: any) => {
      const c = sub.exercise?.module?.course;
      if (c && !courses.has(c.id)) {
        courses.set(c.id, c.title);
      }
    });
    return Array.from(courses.entries()).map(([id, title]) => ({ id, title }));
  }, [rawSubmissions]);

  // ── Handlers ──────────────────────────────────────────────────────────
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
        onSuccess: (updatedSub) => {
          setSelectedSubmission(null);
          if (selectedGroup) {
            const updatedSubs = selectedGroup.submissions.map((s: any) =>
              s.id === selectedSubmission.id
                ? { ...s, ...updatedSub, status: "GRADED" }
                : s,
            );
            setSelectedGroup({ ...selectedGroup, submissions: updatedSubs });
          }
        },
      },
    );
  };

  return (
    <InstructorLayout>
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/80 shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <div className="px-8 pt-8 pb-4">
            <h1 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">
              Grading Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and grade learner submissions across all your courses.
            </p>
          </div>

          <div className="px-8 flex items-center gap-8 border-b border-slate-100">
            <button className="pb-4 text-sm font-bold transition-all relative text-blue-600">
              <div className="flex items-center gap-2">
                Assignments
                <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white bg-blue-600">
                  {groupedSubmissions.length}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            </button>
          </div>

          <div className="px-8 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative group w-80">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={17}
                />
                <Input
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-lg border-slate-200 bg-slate-50/50 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-sm font-medium"
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="h-10 w-[200px] rounded-lg border-slate-200 bg-slate-50/50 text-sm font-medium">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-xl">
                  <SelectItem value="ALL">All Courses</SelectItem>
                  {uniqueCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-slate-50/10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-b border-slate-200/60">
                  <TableHead className="w-[40px] pl-6">
                    <Input type="checkbox" className="h-4 w-4 rounded" />
                  </TableHead>
                  <TableHead className="py-4 font-bold text-slate-500 text-xs">
                    User
                  </TableHead>
                  <TableHead className="py-4 font-bold text-slate-500 text-xs">
                    Course
                  </TableHead>
                  <TableHead className="py-4 font-bold text-slate-500 text-xs">
                    Submission date
                  </TableHead>
                  <TableHead className="py-4 font-bold text-slate-500 text-xs">
                    Grade date
                  </TableHead>
                  <TableHead className="py-4 font-bold text-slate-500 text-xs">
                    Grade
                  </TableHead>
                  <TableHead className="py-4 pr-6 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell colSpan={7} className="py-6 px-6">
                          <div className="h-4 bg-slate-50 rounded w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : groupedSubmissions.map((sub: any) => (
                      <TableRow
                        key={sub.id}
                        className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors group"
                      >
                        <TableCell className="pl-6">
                          <Input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300"
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 shrink-0 rounded-full flex items-center justify-center font-bold text-[10px] text-white",
                                avatarPalette(sub.user?.email ?? sub.userId),
                              )}
                            >
                              {initialsOf(
                                sub.user?.firstname,
                                sub.user?.lastname,
                              )}
                            </div>
                            <span className="font-bold text-slate-700 text-sm whitespace-nowrap">
                              {sub.user?.firstname} {sub.user?.lastname}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="py-4 text-sm text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                          title={sub.courseTitle}
                        >
                          {sub.courseTitle}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-slate-500 font-medium">
                          {format(new Date(sub.createdAt), "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell className="py-4 text-sm text-slate-500 font-medium">
                          {sub.gradedAt
                            ? format(new Date(sub.gradedAt), "MM/dd/yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-bold text-slate-700 text-sm">
                            {sub.status === "PENDING"
                              ? "-"
                              : Math.round(
                                  (sub.totalScore / sub.maxPoints) * 100,
                                )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Sheet
                            open={selectedGroup?.id === sub.id}
                            onOpenChange={(o) => !o && setSelectedGroup(null)}
                          >
                            <SheetTrigger asChild>
                              <button
                                onClick={() => setSelectedGroup(sub)}
                                className="p-2 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <MoreVertical size={18} />
                              </button>
                            </SheetTrigger>

                            {/* ── Submission Review Panel ── */}
                            <SheetContent
                              className={cn(
                                "sm:max-w-[640px] p-0 border-l border-slate-200 shadow-2xl",
                                "flex flex-col h-full bg-white overflow-hidden",
                                // Smoother, GPU-accelerated slide transition
                                "transform-gpu will-change-transform",
                                "data-[state=open]:duration-300 data-[state=closed]:duration-200",
                                "data-[state=open]:ease-out data-[state=closed]:ease-in",
                              )}
                            >
                              <SheetHeader className="px-7 py-6 bg-white border-b border-slate-100 shrink-0 text-left space-y-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    Submission Review
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      "border-none font-semibold text-[10px] tracking-wide px-2.5 py-1 rounded-full",
                                      sub.status === "GRADED"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-amber-50 text-amber-700",
                                    )}
                                  >
                                    {sub.status === "GRADED"
                                      ? "Graded"
                                      : "Needs review"}
                                  </Badge>
                                </div>

                                <SheetTitle className="text-xl font-bold text-slate-900 mt-2 leading-snug">
                                  {sub.quizTitle}
                                </SheetTitle>

                                <SheetDescription asChild>
                                  <div className="flex items-center gap-3 mt-4">
                                    <div
                                      className={cn(
                                        "h-9 w-9 rounded-full flex items-center justify-center font-semibold text-xs text-white shrink-0",
                                        avatarPalette(
                                          sub.user?.email ?? sub.userId,
                                        ),
                                      )}
                                    >
                                      {initialsOf(
                                        sub.user?.firstname,
                                        sub.user?.lastname,
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-slate-800 text-sm leading-tight">
                                        {sub.user?.firstname}{" "}
                                        {sub.user?.lastname}
                                      </span>
                                      <span className="flex items-center gap-1 text-slate-400 text-xs leading-tight mt-0.5">
                                        <Mail size={11} />
                                        {sub.user?.email}
                                      </span>
                                    </div>
                                  </div>
                                </SheetDescription>
                              </SheetHeader>

                              <div className="flex-1 overflow-y-auto custom-scrollbar text-left">
                                {/* Stats strip */}
                                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                                  <div className="px-6 py-5">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                      <ListChecks size={12} />
                                      Score
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-bold text-slate-900">
                                        {sub.totalScore}
                                      </span>
                                      <span className="text-xs font-medium text-slate-400">
                                        / {sub.maxPoints} pts
                                      </span>
                                    </div>
                                  </div>
                                  <div className="px-6 py-5">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                      {sub.status === "GRADED" ? (
                                        <ClipboardCheck size={12} />
                                      ) : (
                                        <Hourglass size={12} />
                                      )}
                                      Status
                                    </p>
                                    <div className="text-base font-bold text-slate-900">
                                      {sub.status === "GRADED"
                                        ? "Completed"
                                        : "Action needed"}
                                    </div>
                                  </div>
                                  <div className="px-6 py-5">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                      Questions
                                    </p>
                                    <div className="text-base font-bold text-slate-900">
                                      {sub.submissions.length}
                                    </div>
                                  </div>
                                </div>

                                {/* Responses */}
                                <div className="px-7 py-6 space-y-4">
                                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <ArrowUpDown size={13} />
                                    Detailed responses
                                  </h3>

                                  {sub.submissions.map(
                                    (item: any, idx: number) => (
                                      <div
                                        key={item.id}
                                        className="rounded-xl border border-slate-200 overflow-hidden"
                                      >
                                        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                          <div className="flex items-center gap-2.5">
                                            <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-semibold">
                                              {idx + 1}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500">
                                              Question {idx + 1}
                                            </span>
                                          </div>
                                          <Badge
                                            className={cn(
                                              "font-semibold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full border-none",
                                              item.status === "PENDING"
                                                ? "bg-amber-50 text-amber-600"
                                                : item.isCorrect
                                                  ? "bg-emerald-50 text-emerald-700"
                                                  : "bg-rose-50 text-rose-600",
                                            )}
                                          >
                                            {item.status === "PENDING"
                                              ? "Needs grading"
                                              : item.isCorrect
                                                ? "Correct"
                                                : "Incorrect"}
                                          </Badge>
                                        </div>

                                        <div className="p-5 space-y-4">
                                          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                                            {cleanTitle(item.exercise?.title)}
                                          </p>

                                          <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                              Student response
                                            </p>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                              {item.answer || (
                                                <span className="italic text-slate-400">
                                                  No response submitted
                                                </span>
                                              )}
                                            </p>
                                          </div>

                                          {item.feedback && (
                                            <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3">
                                              <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
                                                Your feedback
                                              </p>
                                              <p className="text-sm text-slate-700 leading-relaxed">
                                                {item.feedback}
                                              </p>
                                            </div>
                                          )}

                                          <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-baseline gap-1">
                                              <span className="text-lg font-bold text-slate-900">
                                                {item.score}
                                              </span>
                                              <span className="text-xs font-medium text-slate-400">
                                                / {item.exercise?.points} pts
                                              </span>
                                            </div>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                openGradeModal(item)
                                              }
                                              className="h-9 rounded-lg px-4 font-semibold text-xs border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                            >
                                              {item.status === "PENDING"
                                                ? "Grade question"
                                                : "Modify grade"}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            {!isLoading && groupedSubmissions.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Inbox size={48} className="text-slate-100" />
                <p className="font-bold text-slate-400">
                  No submissions found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Grading Overlay ── */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl border border-slate-200 shadow-xl p-0 overflow-hidden flex flex-col max-h-[90vh] gap-0 text-left">
          <div className="px-7 pt-6 pb-5 border-b border-slate-100 shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
              Grade entry
            </span>
            <DialogTitle className="text-lg font-bold text-slate-900 mt-1">
              {cleanTitle(selectedSubmission?.exercise?.title) ||
                "Manual assessment"}
            </DialogTitle>
          </div>

          <div className="px-7 py-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">
                Score
              </label>
              <div className="flex items-center gap-3">
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
                  className="h-11 w-24 rounded-lg border-slate-200 bg-white text-base font-semibold text-center"
                />
                <span className="text-sm text-slate-400 font-medium">
                  out of {selectedSubmission?.exercise?.points} pts
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">
                Verdict
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setGradingForm({ ...gradingForm, isCorrect: true })
                  }
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-md px-4 h-9 font-medium text-sm transition-colors",
                    gradingForm.isCorrect
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <CheckCircle2 size={15} /> Correct
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setGradingForm({ ...gradingForm, isCorrect: false })
                  }
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-md px-4 h-9 font-medium text-sm transition-colors",
                    !gradingForm.isCorrect
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                >
                  <X size={15} /> Incorrect
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">
                Feedback for student
              </label>
              <Textarea
                value={gradingForm.feedback}
                onChange={(e) =>
                  setGradingForm({ ...gradingForm, feedback: e.target.value })
                }
                placeholder="Tell the student how to improve..."
                className="min-h-[110px] rounded-lg border-slate-200 bg-white p-3.5 text-sm resize-none focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>
          </div>

          <div className="px-7 py-4 flex justify-end gap-2.5 shrink-0 border-t border-slate-100 bg-slate-50/60">
            <Button
              variant="ghost"
              onClick={() => setSelectedSubmission(null)}
              className="h-9 px-4 rounded-lg font-medium text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={submitGrade}
              disabled={gradeMutation.isPending}
              className="h-9 px-5 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700"
            >
              {gradeMutation.isPending ? "Saving..." : "Save grade"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </InstructorLayout>
  );
};

export default InstructorSubmissions;
