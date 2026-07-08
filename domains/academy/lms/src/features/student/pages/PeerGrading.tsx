import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "@/features/student/components/StudentLayout";
import { useEnrollments } from "@/hooks/useAcademy";
import { academyService } from "@/services/academyService";
import { useQueries } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Search,
  CheckCircle2,
  Clock,
  MessageSquareText,
  Inbox,
  Loader2,
  ChevronRight,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────
const cleanTitle = (raw: string | undefined | null) => {
  if (!raw) return "Untitled exercise";
  return raw.split("|||")[0].trim();
};

const parseOptions = (opts: any): string[] => {
  if (!opts) return [];
  if (Array.isArray(opts)) return opts;
  if (typeof opts === "string") {
    try {
      const p = JSON.parse(opts);
      return Array.isArray(p) ? p : opts.split(",").map((o: string) => o.trim());
    } catch {
      return opts.split(",").map((o: string) => o.trim());
    }
  }
  return [];
};

// ── Types ─────────────────────────────────────────────────────────────────
export interface FlatSubmission {
  id: string | number;
  exerciseId: string | number;
  exerciseTitle: string;
  question: string;
  lessonTitle: string;
  courseTitle: string;
  answer: string;
  options: string[];
  correctAnswer: string | null;
  status: "GRADED" | "PENDING";
  score: number | null;
  maxPoints: number;
  feedback: string | null;
  isCorrect: boolean | null;
  submittedAt: string;
  gradedAt: string | null;
}

interface CourseRow {
  courseTitle: string;
  submissions: FlatSubmission[];
  graded: number;
  pending: number;
  withFeedback: number;
  lastActivity: string;
}

// ── Hook ──────────────────────────────────────────────────────────────────
export const useMyGradedSubmissions = () => {
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();

  const courseIds: string[] = useMemo(() => {
    if (!enrollments) return [];
    return enrollments
      .filter(
        (e: any) =>
          e.status === "ACTIVE" ||
          e.status === "COMPLETED" ||
          e.status === "ENROLLED",
      )
      .map((e: any) => String(e.courseId ?? e.course?.id))
      .filter(Boolean);
  }, [enrollments]);

  const reportQueries = useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: ["course-report", courseId],
      queryFn: () => academyService.getCourseReport(courseId),
      staleTime: 2 * 60 * 1000,
      enabled: courseIds.length > 0,
    })),
  });

  const reportsLoading = reportQueries.some((q) => q.isLoading);

  const submittedItems = useMemo(() => {
    if (reportsLoading) return [];
    const result: Array<{
      exerciseId: string;
      courseId: string;
      lessonTitle: string;
      courseTitle: string;
      reportEx: any;
    }> = [];

    reportQueries.forEach((query, idx) => {
      const report = query.data;
      const courseId = courseIds[idx];
      if (!report || !Array.isArray(report)) return;

      const fallbackTitle =
        enrollments?.find(
          (e: any) => String(e.courseId ?? e.course?.id) === String(courseId),
        )?.course?.title ?? "Unknown Course";

      report.forEach((moduleObj: any) => {
        const courseTitle = moduleObj.course?.title || fallbackTitle;
        (moduleObj.lessons || []).forEach((lesson: any) => {
          const lessonTitle = lesson.title || lesson.lessonTitle || "";
          (lesson.exercises || []).forEach((rex: any) => {
            if (
              rex.status === "GRADED" ||
              rex.status === "COMPLETED" ||
              rex.status === "PENDING" ||
              rex.answer
            ) {
              result.push({
                exerciseId: String(rex.exerciseId),
                courseId,
                lessonTitle,
                courseTitle,
                reportEx: rex,
              });
            }
          });
        });
      });
    });

    return result;
  }, [reportQueries, courseIds, enrollments, reportsLoading]);

  const detailQueries = useQueries({
    queries: submittedItems.map(({ exerciseId }) => ({
      queryKey: ["exercise", exerciseId],
      queryFn: () => academyService.getExerciseDetails(exerciseId),
      staleTime: 5 * 60 * 1000,
      enabled: submittedItems.length > 0,
    })),
  });

  const detailsLoading = detailQueries.some((q) => q.isLoading);
  const isLoading = enrollmentsLoading || reportsLoading || detailsLoading;

  const submissions: FlatSubmission[] = useMemo(() => {
    if (detailsLoading || submittedItems.length === 0) return [];

    return submittedItems
      .map(({ lessonTitle, courseTitle, reportEx }, idx) => {
        const detail = detailQueries[idx]?.data;
        const mySubmission = detail?.mySubmission || detail?.submission;

        const answer =
          mySubmission?.answer || reportEx?.answer || detail?.userAnswer || "";
        const status: "GRADED" | "PENDING" =
          mySubmission?.status === "GRADED" ||
          reportEx?.status === "GRADED" ||
          reportEx?.status === "COMPLETED"
            ? "GRADED"
            : "PENDING";
        const score =
          mySubmission?.score !== undefined
            ? mySubmission.score
            : reportEx?.score !== undefined
              ? reportEx.score
              : null;
        const feedback = mySubmission?.feedback || reportEx?.feedback || null;
        const isCorrect =
          mySubmission?.isCorrect !== undefined
            ? mySubmission.isCorrect
            : reportEx?.isCorrect !== undefined
              ? reportEx.isCorrect
              : null;
        const submittedAt =
          mySubmission?.createdAt ||
          reportEx?.createdAt ||
          reportEx?.submittedAt ||
          new Date().toISOString();
        const gradedAt =
          status === "GRADED"
            ? mySubmission?.updatedAt || reportEx?.updatedAt || null
            : null;

        return {
          id: mySubmission?.id || reportEx?.exerciseId,
          exerciseId: reportEx?.exerciseId,
          exerciseTitle: cleanTitle(detail?.title || detail?.exerciseTitle),
          question: detail?.question || cleanTitle(detail?.title) || "",
          lessonTitle,
          courseTitle,
          answer,
          options: parseOptions(detail?.options),
          correctAnswer: detail?.correctAnswer ?? null,
          status,
          score,
          maxPoints: detail?.points || detail?.maxPoints || 1,
          feedback,
          isCorrect,
          submittedAt,
          gradedAt,
        } as FlatSubmission;
      })
      .filter((s) => s.answer || s.status === "GRADED")
      .sort((a, b) => {
        const aRank = (a.feedback ? 2 : 0) + (a.status === "GRADED" ? 1 : 0);
        const bRank = (b.feedback ? 2 : 0) + (b.status === "GRADED" ? 1 : 0);
        if (aRank !== bRank) return bRank - aRank;
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [submittedItems, detailQueries, detailsLoading]);

  return { submissions, isLoading };
};

// ── Page ──────────────────────────────────────────────────────────────────
const PeerGrading = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { submissions, isLoading } = useMyGradedSubmissions();

  const courseRows: CourseRow[] = useMemo(() => {
    const map = new Map<string, CourseRow>();
    submissions.forEach((sub) => {
      const key = sub.courseTitle;
      if (!map.has(key)) {
        map.set(key, {
          courseTitle: sub.courseTitle,
          submissions: [],
          graded: 0,
          pending: 0,
          withFeedback: 0,
          lastActivity: sub.submittedAt,
        });
      }
      const row = map.get(key)!;
      row.submissions.push(sub);
      if (sub.status === "GRADED") row.graded++;
      else row.pending++;
      if (sub.feedback) row.withFeedback++;
      if (new Date(sub.submittedAt) > new Date(row.lastActivity)) {
        row.lastActivity = sub.submittedAt;
      }
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
    );
  }, [submissions]);

  const filtered = useMemo(() => {
    if (!search.trim()) return courseRows;
    return courseRows.filter((r) =>
      r.courseTitle.toLowerCase().includes(search.toLowerCase()),
    );
  }, [courseRows, search]);

  return (
    <StudentLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">
              Instructor Feedback
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View grades and feedback from your instructors on submitted exercises.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search by course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-white border-slate-200 text-sm rounded-lg"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-b border-slate-200/60">
                  <TableHead className="py-3.5 pl-6 font-bold text-slate-500 text-xs">
                    Course
                  </TableHead>
                  <TableHead className="py-3.5 font-bold text-slate-500 text-xs">
                    Submissions
                  </TableHead>
                  <TableHead className="py-3.5 font-bold text-slate-500 text-xs">
                    Graded
                  </TableHead>
                  <TableHead className="py-3.5 font-bold text-slate-500 text-xs">
                    Pending
                  </TableHead>
                  <TableHead className="py-3.5 font-bold text-slate-500 text-xs">
                    Feedback
                  </TableHead>
                  <TableHead className="py-3.5 font-bold text-slate-500 text-xs">
                    Last Activity
                  </TableHead>
                  <TableHead className="py-3.5 pr-6 text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="py-5 px-6">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Inbox size={40} className="text-slate-200" />
                        <p className="text-sm font-semibold text-slate-400">
                          {courseRows.length === 0
                            ? "No graded submissions yet."
                            : "No courses match your search."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow
                      key={row.courseTitle}
                      className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/peer-grading/${encodeURIComponent(row.courseTitle)}`,
                          { state: { courseTitle: row.courseTitle } },
                        )
                      }
                    >
                      <TableCell className="py-4 pl-6 font-semibold text-slate-800 text-sm">
                        {row.courseTitle}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-semibold text-slate-700">
                        {row.submissions.length}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          {row.graded}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {row.pending > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                            <Clock size={13} className="text-amber-500" />
                            {row.pending}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {row.withFeedback > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                            <MessageSquareText size={13} className="text-blue-500" />
                            {row.withFeedback}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-sm text-slate-500 font-medium">
                        {format(new Date(row.lastActivity), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800">
                          View details <ChevronRight size={13} />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-4 border-t border-slate-100">
                <Loader2 size={14} className="animate-spin" />
                Loading your submissions...
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default PeerGrading;
