import { useState, useEffect } from "react";
import { courseApi } from "../api/courseApi";
import {
  FaTimes,
  FaCheck,
  FaBan,
  FaBook,
  FaUser,
  FaTag,
  FaMoneyBillWave,
} from "react-icons/fa";

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

interface ReviewCourseModalProps {
  course: Course | null;
  onClose: () => void;
  onApprove: (id: number, notes: string) => void;
  onReject: (id: number, notes: string) => void;
  isProcessing: boolean;
}

const ReviewCourseModal: React.FC<ReviewCourseModalProps> = ({
  course,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [notes, setNotes] = useState("");

  if (!course) return null;

  const isActionable =
    course.status === "PENDING_APPROVAL" || course.status === "DRAFT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#10141d] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start p-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Review Course
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <FaBook className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Reviewing:</span>
              <span className="text-white font-semibold">{course.title}</span>
              <span
                className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  course.status === "DRAFT"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-blue-500/20 text-blue-500"
                }`}
              >
                {course.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="px-8 py-4 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#171f29] p-5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FaUser size={12} />
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Instructor
                </div>
              </div>
              <div className="text-white font-semibold truncate text-sm">
                {course.instructor
                  ? `${course.instructor.firstname} ${course.instructor.lastname}`
                  : "Unknown"}
              </div>
            </div>
            <div className="bg-[#171f29] p-5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FaTag size={12} />
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Category
                </div>
              </div>
              <div className="text-white font-semibold truncate text-sm">
                {course.category}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#171f29] p-5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FaMoneyBillWave size={12} />
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Price
                </div>
              </div>
              <div className="text-white font-semibold truncate text-sm">
                {course.price ? `$${course.price}` : "Free"}
              </div>
            </div>
            <div className="bg-[#171f29] p-5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FaTags size={12} />
                <div className="text-[10px] uppercase tracking-widest font-bold">
                  Level
                </div>
              </div>
              <div className="text-white font-semibold truncate text-sm">
                {course.targetLevel || "All Levels"}
              </div>
            </div>
          </div>

          {isActionable ? (
            /* Comments & Actions */
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 font-medium mb-2.5">
                  Reviewer Comments / Reason
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#171f29] border border-white/10 rounded-xl p-4 text-gray-200 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none resize-none h-32 text-sm placeholder-gray-600 transition-all font-medium"
                  placeholder="Provide specific feedback or reasons for this decision..."
                />
                <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed">
                  This feedback will help track the review history.
                </p>
              </div>

              {/* Actions - Integrated */}
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-white/5">
                {/* Reject Button */}
                <button
                  onClick={() => onReject(course.id, notes)}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-full bg-[#1a0f0f] border border-red-900/30 text-red-500 font-semibold text-xs hover:bg-[#2a1212] transition-all flex items-center gap-2 disabled:opacity-50 tracking-wide uppercase"
                >
                  <FaBan size={12} />
                  Reject
                </button>

                {/* Approve Button */}
                <button
                  onClick={() => onApprove(course.id, notes)}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-full bg-[#00e376] text-black font-bold text-xs hover:bg-[#00c968] transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-green-900/20 tracking-wide uppercase"
                >
                  <div className="bg-black rounded-full p-0.5">
                    <FaCheck size={8} className="text-white" />
                  </div>
                  {course.status === "DRAFT"
                    ? "Publish Course"
                    : "Approve Course"}
                </button>
              </div>
            </div>
          ) : (
            /* Status Display */
            <div
              className={`p-6 rounded-xl border ${
                course.status === "PUBLISHED"
                  ? "bg-green-500/10 border-green-500/20"
                  : course.status === "REJECTED"
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-gray-500/10 border-gray-500/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {course.status === "PUBLISHED" ? (
                  <div className="bg-green-500 rounded-full p-1">
                    <FaCheck size={12} className="text-black" />
                  </div>
                ) : course.status === "REJECTED" ? (
                  <div className="bg-red-500 rounded-full p-1">
                    <FaBan size={12} className="text-white" />
                  </div>
                ) : (
                  <div className="bg-gray-500 rounded-full p-1">
                    <FaBook size={12} className="text-white" />
                  </div>
                )}
                <span
                  className={`text-lg font-bold ${
                    course.status === "PUBLISHED"
                      ? "text-green-500"
                      : course.status === "REJECTED"
                        ? "text-red-500"
                        : "text-gray-400"
                  }`}
                >
                  Course {course.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                This course has already been processed.
              </p>
              {course.rejectionReason && (
                <div className="mt-3 text-sm text-red-400 bg-red-900/10 p-3 rounded-lg border border-red-900/20">
                  <span className="font-semibold">Rejection Reason:</span>{" "}
                  {course.rejectionReason}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Also adding missing icon
import { FaTags } from "react-icons/fa";

const CoursesManagementPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    pending: 0,
  });

  const fetchCourses = async () => {
    try {
      const response = await courseApi.getAllCoursesForAdmin();
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (id: number, _notes: string) => {
    // Note: notes are not currently used by backend for approval but requested by UI design
    setIsProcessing(true);
    try {
      await courseApi.approveCourse(id);
      await fetchCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error approving course:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    setIsProcessing(true);
    try {
      await courseApi.rejectCourse(id, reason);
      await fetchCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error rejecting course:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async (id: number) => {
    // Keep this separate as it might not need the review modal?
    // Usually 'Publish' is same as Approve if coming from Draft, but here we have PENDING_APPROVAL flow.
    // If Admin is forcing publish on DRAFT course (rare but possible), we can keep original logic or integrate.
    // The previous code had a specific button for DRAFT -> PUBLISH.
    try {
      await courseApi.updateCourseStatus(id, "PUBLISHED");
      fetchCourses();
    } catch (err) {
      console.error(err);
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
                      {course.status === "PENDING_APPROVAL" ? (
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          Review
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className="text-gray-500 hover:text-gray-900 px-4 py-1.5 text-xs font-medium transition-colors border border-gray-200 rounded-md hover:bg-gray-50"
                          >
                            View Details
                          </button>
                          {/* Keep utility buttons for quick actions if needed, or rely on modal/view details? 
                                 The prompt is about the modal. I will keep utility buttons for non-pending to avoid breaking workflows too much,
                                 but the main "Approve/Reject" flow is now in modal. 
                                 However, to be "same UI", typically means simpler actions in table. 
                                 I'll hide the explicit buttons for Pending. 
                                 For Published/Draft, I will keep the existing utility buttons for convenience as they are not "Pending Review".
                             */}
                          {course.status === "DRAFT" && (
                            <button
                              onClick={() => handlePublish(course.id)}
                              className="text-blue-600 hover:text-blue-900 text-xs px-2"
                              title="Publish"
                            >
                              Publish
                            </button>
                          )}
                        </div>
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

      {/* Review Modal */}
      {selectedCourse && (
        <ReviewCourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default CoursesManagementPage;
