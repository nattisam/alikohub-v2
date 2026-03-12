import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { academyService } from "@/services/academyService";
import { toast } from "sonner";

export const useCourses = (params?: any, options?: any) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => academyService.getCourses(params),
    ...options,
  });
};

export const useCoursesByCategory = (
  category: string,
  params?: { page?: number; pageSize?: number },
  options?: any,
) => {
  return useQuery({
    queryKey: ["courses", "category", category, params],
    queryFn: () => academyService.getCoursesByCategory(category, params),
    enabled: !!category,
    ...options,
  });
};

export const useCoursesByDifficulty = (
  difficulty: string,
  params?: { page?: number; pageSize?: number },
  options?: any,
) => {
  return useQuery({
    queryKey: ["courses", "difficulty", difficulty, params],
    queryFn: () => academyService.getCoursesByDifficulty(difficulty, params),
    enabled: !!difficulty,
    ...options,
  });
};

export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => academyService.getCourseDetails(courseId),
    enabled: !!courseId,
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["course", "slug", slug],
    queryFn: () => academyService.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      paymentGateway = "CHAPA",
    }: {
      courseId: string | number;
      paymentGateway?: string;
    }) => academyService.enrollInCourse(courseId, paymentGateway),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success("Enrolled successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to enroll");
    },
  });
};

export const useEnrollments = () => {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () => academyService.getMyEnrollments(),
  });
};

export const useAcademyProfile = () => {
  return useQuery({
    queryKey: ["academy-profile"],
    queryFn: () => academyService.getProfile(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

export const useUpdateAcademyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => academyService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academy-profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => academyService.getNotifications(),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notifId: string) =>
      academyService.markNotificationRead(notifId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notifId: string) => academyService.deleteNotification(notifId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });
};

export const useStudentAnalytics = () => {
  return useQuery({
    queryKey: ["student-analytics"],
    queryFn: () => academyService.getStudentAnalytics(),
  });
};

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => academyService.getStudentDashboard(),
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => academyService.markLessonComplete(courseId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["student-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
    },
  });
};

export const useSubmitExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      exerciseId,
      answer,
    }: {
      exerciseId: string;
      answer: string;
    }) => academyService.submitExercise(exerciseId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
      toast.success("Exercise submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit exercise");
    },
  });
};

// Instructor Hooks
export const useInstructorCourses = (params?: any) => {
  return useQuery({
    queryKey: ["instructor-courses", params],
    queryFn: () => academyService.instructor.getMyCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInstructorStats = () => {
  return useQuery({
    queryKey: ["instructor-stats"],
    queryFn: () => academyService.instructor.getStats(),
  });
};

export const useCourseAnalytics = (courseId: string) => {
  return useQuery({
    queryKey: ["course-analytics", courseId],
    queryFn: () => academyService.instructor.getCourseAnalytics(courseId),
    enabled: !!courseId,
  });
};

export const useTeachingSchedules = (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["teaching-schedules", params],
    queryFn: () => academyService.instructor.getTeachingSchedules(params),
  });
};

export const useCreateTeachingSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      academyService.instructor.createTeachingSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teaching-schedules"] });
      toast.success("Schedule created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create schedule");
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      academyService.instructor.createCourse(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create course");
    },
  });
};
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      formData,
    }: {
      courseId: string;
      formData: FormData;
    }) => academyService.instructor.updateCourse(courseId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Course updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update course");
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      academyService.instructor.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      toast.success("Course deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete course");
    },
  });
};

export const useSubmitCourseForApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      academyService.instructor.submitCourseForApproval(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success("Course submitted for approval!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit course");
    },
  });
};

// Curriculum Hooks (Instructor)
export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      courseId: string;
      title: string;
      description?: string;
    }) => academyService.instructor.createModule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Module created!");
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      data,
      courseId,
    }: {
      moduleId: string;
      data: any;
      courseId: string;
    }) => academyService.instructor.updateModule(moduleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Module updated!");
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId }: { moduleId: string; courseId: string }) =>
      academyService.instructor.deleteModule(moduleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Module deleted!");
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { moduleId: string; title: string; type: string }) =>
      academyService.instructor.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Lesson created!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create lesson");
    },
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => {
      if (data instanceof FormData) {
        return academyService.instructor.uploadContent(data);
      }
      return academyService.instructor.createContent(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Content added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add content");
    },
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contentId: string) =>
      academyService.instructor.deleteContent(contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Content deleted!");
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exerciseId: string) =>
      academyService.instructor.deleteExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Exercise deleted!");
    },
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => academyService.instructor.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course"],
      });
      toast.success("Exercise created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create exercise");
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      data,
      courseId,
    }: {
      lessonId: string;
      data: any;
      courseId: string;
    }) => academyService.instructor.updateLesson(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Lesson updated!");
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId }: { lessonId: string; courseId: string }) =>
      academyService.instructor.deleteLesson(lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Lesson deleted!");
    },
  });
};

// Admin Hooks
export const useTeacherApplications = () => {
  return useQuery({
    queryKey: ["teacher-applications"],
    queryFn: () => academyService.admin.getAllApplications(),
  });
};

export const useAdminCourses = () => {
  return useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => academyService.admin.getAllCourses(),
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => academyService.admin.getPlatformAnalytics(),
  });
};

export const useApproveTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appId,
      reviewNotes,
    }: {
      appId: string;
      reviewNotes: string;
    }) => academyService.admin.approveApplication(appId, reviewNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
      toast.success("Teacher application approved!");
    },
  });
};

export const useRejectTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appId,
      reviewNotes,
    }: {
      appId: string;
      reviewNotes: string;
    }) => academyService.admin.rejectApplication(appId, reviewNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
      toast.success("Teacher application rejected");
    },
  });
};

export const usePendingCourses = () => {
  return useQuery({
    queryKey: ["pending-courses"],
    queryFn: () => academyService.admin.getPendingCourses(),
  });
};

export const useApproveCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) =>
      academyService.admin.approveCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-courses"] });
      toast.success("Course approved successfully!");
    },
  });
};

export const useRejectCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, reason }: { courseId: string; reason: string }) =>
      academyService.admin.rejectCourse(courseId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-courses"] });
      toast.success("Course rejected");
    },
  });
};
