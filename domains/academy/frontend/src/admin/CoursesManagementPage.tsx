import { useState, useEffect } from "react";
import { courseApi } from "../api/courseApi";
import Swal from "sweetalert2";

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  instructorId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING_APPROVAL" | "REJECTED";
  skills: string[];
  conceptsLearned: string[];
  outcomes: string[];
  rejectionReason: string | null;
  estimatedTime: number | null;
  targetLevel: string | null;
  enrolledNum: number;
  rating: number | null;
  price: number | null;
  prerequisites: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: number;
    firebaseId: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    globalRole: string;
    profilePicture: string | null;
    bio: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    academyUser: {
      id: string;
      userId: string;
      role: string;
      activeRole: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    consultancyUser: unknown;
    contechUser: {
      id: string;
      userId: string;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    eventsUser: {
      id: string;
      userId: string;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    careersUser: unknown;
  };
}

const CoursesManagementPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getAllCoursesForAdmin();

        // Handle the expected response structure robustly
        const responseData = response?.data;
        let coursesData: Course[] = [];

        if (
          responseData &&
          typeof responseData === "object" &&
          Array.isArray(responseData.items)
        ) {
          coursesData = responseData.items;
        } else if (Array.isArray(responseData)) {
          coursesData = responseData;
        } else {
          coursesData = [];
        }

        setCourses(coursesData);

        // Calculate statistics
        const total = coursesData.length;
        const published = coursesData.filter(
          (course: Course) => course.status === "PUBLISHED",
        ).length;
        const draft = coursesData.filter(
          (course: Course) => course.status === "DRAFT",
        ).length;
        const pending = coursesData.filter(
          (course: Course) => course.status === "PENDING_APPROVAL",
        ).length;

        setStats({
          total,
          published,
          draft,
          pending,
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await courseApi.approveCourse(id);
      // Refresh the courses list
      const response = await courseApi.getAllCoursesForAdmin();

      // Handle the expected response structure robustly
      const responseData = response?.data;
      let coursesData: Course[] = [];

      if (
        responseData &&
        typeof responseData === "object" &&
        Array.isArray(responseData.items)
      ) {
        coursesData = responseData.items;
      } else if (Array.isArray(responseData)) {
        coursesData = responseData;
      } else {
        coursesData = [];
      }

      setCourses(coursesData);
      Swal.fire({
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.3)",
        timer: 2500,
        html: `
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <div class="flex justify-center mb-4">
              <div class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Course Approved</h2>
            <p class="text-sm text-gray-500 mt-2">The course has been approved successfully.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error approving course:", error);
      Swal.fire({
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.3)",
        timer: 3000,
        html: `
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <div class="flex justify-center mb-4">
              <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Failed to Approve</h2>
            <p class="text-sm text-gray-500 mt-2">An error occurred while approving the course.</p>
          </div>
        `,
      });
    }
  };

  const handleReject = async (id: number) => {
    const { value: formValues } = await Swal.fire({
      showConfirmButton: false,
      showCancelButton: false,
      background: "transparent",
      backdrop: "rgba(0,0,0,0.3)",
      html: `
        <div class="bg-white rounded-2xl shadow-xl p-8 w-[440px]">
          <div class="flex justify-center mb-4">
            <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-lg font-semibold text-gray-900 text-center mb-2">Reject Course</h2>
          <p class="text-sm text-gray-500 text-center mb-6">Please provide a reason for rejecting this course.</p>
          
          <div class="mb-6">
            <label for="swal-reject-reason" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rejection Reason</label>
            <textarea 
              id="swal-reject-reason" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 resize-none text-sm transition-all"
              rows="4"
              placeholder="Enter the reason for rejection..."
            ></textarea>
            <div id="swal-validation-message" class="text-red-600 text-xs mt-2 font-medium hidden"></div>
          </div>
          
          <div class="flex gap-3">
            <button 
              id="swal-cancel-btn" 
              class="flex-1 py-3 px-4 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              id="swal-confirm-btn" 
              class="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
            >
              Reject Course
            </button>
          </div>
        </div>
      `,
      didOpen: () => {
        const confirmBtn = document.getElementById("swal-confirm-btn");
        const cancelBtn = document.getElementById("swal-cancel-btn");
        const textarea = document.getElementById(
          "swal-reject-reason",
        ) as HTMLTextAreaElement;
        const validationMsg = document.getElementById(
          "swal-validation-message",
        );

        if (cancelBtn) {
          cancelBtn.onclick = () => Swal.close();
        }

        if (confirmBtn && textarea) {
          confirmBtn.onclick = () => {
            const reason = textarea.value.trim();
            if (!reason) {
              if (validationMsg) {
                validationMsg.textContent = "Please provide a rejection reason";
                validationMsg.classList.remove("hidden");
              }
              return;
            }
            Swal.close();
            Swal.fire({ isConfirmed: true, value: { reason } } as any);
          };
        }

        // Clear validation on input
        if (textarea && validationMsg) {
          textarea.oninput = () => {
            validationMsg.classList.add("hidden");
          };
        }
      },
    });

    const reason = formValues?.reason;

    if (reason) {
      try {
        await courseApi.rejectCourse(id, reason);
        // Refresh the courses list
        const response = await courseApi.getAllCoursesForAdmin();

        // Handle the expected response structure robustly
        const responseData = response?.data;
        let coursesData: Course[] = [];

        if (
          responseData &&
          typeof responseData === "object" &&
          Array.isArray(responseData.items)
        ) {
          coursesData = responseData.items;
        } else if (Array.isArray(responseData)) {
          coursesData = responseData;
        } else {
          coursesData = [];
        }

        setCourses(coursesData);
        Swal.fire({
          showConfirmButton: false,
          background: "transparent",
          backdrop: "rgba(0,0,0,0.3)",
          timer: 2500,
          html: `
            <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
              <div class="flex justify-center mb-4">
                <div class="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Course Rejected</h2>
              <p class="text-sm text-gray-500 mt-2">The course has been rejected.</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Error rejecting course:", error);
        Swal.fire({
          showConfirmButton: false,
          background: "transparent",
          backdrop: "rgba(0,0,0,0.3)",
          timer: 3000,
          html: `
            <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
              <div class="flex justify-center mb-4">
                <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 class="text-lg font-semibold text-gray-900">Failed to Reject</h2>
              <p class="text-sm text-gray-500 mt-2">An error occurred while rejecting the course.</p>
            </div>
          `,
        });
      }
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await courseApi.updateCourseStatus(id, "PUBLISHED");
      // Refresh the courses list
      const response = await courseApi.getAllCoursesForAdmin();

      // Handle the expected response structure robustly
      const responseData = response?.data;
      let coursesData: Course[] = [];

      if (
        responseData &&
        typeof responseData === "object" &&
        Array.isArray(responseData.items)
      ) {
        coursesData = responseData.items;
      } else if (Array.isArray(responseData)) {
        coursesData = responseData;
      } else {
        coursesData = [];
      }

      setCourses(coursesData);
      Swal.fire({
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.3)",
        timer: 2500,
        html: `
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <div class="flex justify-center mb-4">
              <div class="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Course Published</h2>
            <p class="text-sm text-gray-500 mt-2">The course is now live and visible to students.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error publishing course:", error);
      Swal.fire({
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.3)",
        timer: 3000,
        html: `
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <div class="flex justify-center mb-4">
              <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Failed to Publish</h2>
            <p class="text-sm text-gray-500 mt-2">An error occurred while publishing the course.</p>
          </div>
        `,
      });
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await courseApi.updateCourseStatus(id, "ARCHIVED");
      // Refresh the courses list
      const response = await courseApi.getAllCoursesForAdmin();

      // Handle the expected response structure robustly
      const responseData = response?.data;
      let coursesData: Course[] = [];

      if (
        responseData &&
        typeof responseData === "object" &&
        Array.isArray(responseData.items)
      ) {
        coursesData = responseData.items;
      } else if (Array.isArray(responseData)) {
        coursesData = responseData;
      } else {
        coursesData = [];
      }

      setCourses(coursesData);
      Swal.fire({
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.3)",
        timer: 2500,
        html: `
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <div class="flex justify-center mb-4">
              <div class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Course Archived</h2>
            <p class="text-sm text-gray-500 mt-2">The course has been archived successfully.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error archiving course:", error);
      Swal.fire({
        showConfirmButton: false,
        background: "transparent",
        backdrop: "rgba(0,0,0,0.3)",
        timer: 3000,
        html: `
          <div class="bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <div class="flex justify-center mb-4">
              <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Failed to Archive</h2>
            <p class="text-sm text-gray-500 mt-2">An error occurred while archiving the course.</p>
          </div>
        `,
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING_APPROVAL":
        return "bg-blue-100 text-blue-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Courses
        </h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Course List</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md"
                          src={course.thumbnail}
                          alt="Thumbnail"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {course.shortDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.instructor
                      ? `${course.instructor.firstname} ${course.instructor.lastname}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.enrolledNum}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(course.status)}`}
                    >
                      {course.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {course.status === "PENDING_APPROVAL" && (
                        <>
                          <button
                            onClick={() => handleApprove(course.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(course.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {course.status === "DRAFT" && (
                        <button
                          onClick={() => handlePublish(course.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Publish"
                        >
                          Publish
                        </button>
                      )}
                      {course.status === "PUBLISHED" && (
                        <button
                          onClick={() => handleArchive(course.id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Archive"
                        >
                          Archive
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        View
                      </button>
                      {course.status !== "REJECTED" && (
                        <button
                          onClick={() => handleReject(course.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Course Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Courses:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Published:</span>
              <span className="font-medium">{stats.published}</span>
            </div>
            <div className="flex justify-between">
              <span>Draft:</span>
              <span className="font-medium">{stats.draft}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Approval:</span>
              <span className="font-medium">{stats.pending}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Top Categories</h3>
          <div className="space-y-2">
            {Array.from(new Set(courses.map((course) => course.category)))
              .slice(0, 3)
              .map((category) => {
                const count = courses.filter(
                  (course) => course.category === category,
                ).length;
                return (
                  <div key={category} className="flex justify-between">
                    <span>{category}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesManagementPage;
