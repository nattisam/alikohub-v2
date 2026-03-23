import React, { useState } from "react";
import InstructorNavbar from "@/components/InstructorNavbar";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstructorCourses, useDeleteCourse } from "@/hooks/useAcademy";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { academyService } from "@/services/academyService";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal.tsx";

const InstructorCourses = () => {
  const {
    data: coursesData,
    isLoading,
    refetch,
  } = useInstructorCourses({ page: 1, pageSize: 10 });

  const deleteCourseMutation = useDeleteCourse();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmitForApproval = async (courseId: string) => {
    try {
      await academyService.instructor.submitCourseForApproval(courseId);
      toast.success("Course submitted for review successfully!");
      refetch(); // Refresh the courses list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit course");
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteCourseMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          refetch();
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <InstructorNavbar />

      <main className="section-container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">
              My Courses
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and monitor your curriculum content.
            </p>
          </div>
          <Button
            asChild
            className="gap-2 bg-accent hover:bg-amber-light text-slate-900"
          >
            <Link to="/instructor/courses/new">
              <PlusCircle className="w-4 h-4" /> Create Course
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-10" placeholder="Search courses..." />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Status
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Category
            </Button>
          </div>
        </div>

        {/* Courses Table/List */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="h-10 bg-slate-100 rounded" />
                        </td>
                      </tr>
                    ))
                ) : !coursesData?.courses ||
                  coursesData.courses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      You haven't created any courses yet.
                    </td>
                  </tr>
                ) : (
                  (coursesData?.courses || []).map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                            {course.thumbnail && (
                              <img
                                src={course.thumbnail}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                              {course.title}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                              {course.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            course.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-600"
                              : course.status === "PENDING"
                                ? "bg-amber-50 text-amber-600"
                                : course.status === "REJECTED"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {course.enrolledCount || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {course.isFree ? "Free" : `$${course.price}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Submit for Approval - Only for DRAFT courses */}
                          {course.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-emerald-600 font-medium"
                              onClick={() => handleSubmitForApproval(course.id)}
                            >
                              Submit
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-accent font-medium"
                            asChild
                            disabled={course.status === "REJECTED"}
                          >
                            <Link to={`/instructor/courses/${course.id}`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-red-600 font-medium"
                            onClick={() => setDeleteId(course.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course?"
        description="Are you sure you want to delete this course? This action cannot be undone and all modules, lessons, and student progress will be permanently removed."
        isDeleting={deleteCourseMutation.isPending}
      />
    </div>
  );
};

export default InstructorCourses;
