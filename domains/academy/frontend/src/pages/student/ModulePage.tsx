import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import {
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaVideo,
  FaFilePdf,
} from "react-icons/fa";
import type { CourseModule } from "../../components/common/types";

const ModulePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({});
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (courseId) fetchCourseModules(Number(courseId));
  }, [courseId]);

  const fetchCourseModules = async (id: number) => {
    try {
      setLoading(true);

      const courseRes = await courseApi.getCourse(id);
      setCourseTitle(courseRes.data.title);
      setCourseDescription(courseRes.data.longDescription);

      const modulesRes = await courseApi.getModules(id);

      const modulesWithLessons = await Promise.all(
        modulesRes.data.map(async (module: CourseModule) => {
          try {
            const lessonsRes = await courseApi.getLessons(module.id);
            return { ...module, lessons: lessonsRes.data };
          } catch {
            return { ...module, lessons: [] };
          }
        })
      );

      setModules(modulesWithLessons);
    } catch {
      setError("Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleViewLesson = (lessonId: number, title: string) => {
    if (!courseId) return;
    navigate(
      `/student-dashboard/mycourses/${courseId}/module/lesson/${title
        .replace(/\s+/g, "-")
        .toLowerCase()}/${lessonId}`
    );
  };

  const getContentIcon = (type: string) => {
    if (type === "VIDEO") return <FaVideo className="text-red-500" />;
    if (type === "PDF") return <FaFilePdf className="text-red-600" />;
    return <FaFile className="text-blue-500" />;
  };

  const calculateProgress = () => {
    const lessons = modules.flatMap((m) => m.lessons);
    if (!lessons.length) return 0;
    const completed = lessons.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    return Math.round((completed / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <Link
            to="/student-dashboard/mycourses"
            className="text-blue-600 hover:underline"
          >
            ← Back to My Courses
          </Link>

          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:w-64"
          />
        </div>

        {/* HEADER */}
        <h1 className="text-3xl font-bold">
          Course {courseId}: {courseTitle}
        </h1>
        <p className="mt-2 text-gray-600 max-w-3xl">{courseDescription}</p>

        {/* PROGRESS + ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6">
          <div className="w-full md:w-64">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {calculateProgress()}% complete
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Continue Learning
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Add to Wishlist
            </button>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* CURRICULUM */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow">
            <h2 className="px-4 py-3 font-semibold border-b">Curriculum</h2>

            <div className="divide-y">
              {modules
                .filter(
                  (module) =>
                    searchTerm === "" ||
                    module.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    module.lessons.some((lesson) =>
                      lesson.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                )
                .map((module) => (
                  <div key={module.id}>
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50"
                    >
                      <span className="font-medium">{module.title}</span>
                      {expandedModules[module.id] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </button>

                    {expandedModules[module.id] && (
                      <div className="bg-gray-50">
                        {module.lessons
                          .filter(
                            (lesson) =>
                              searchTerm === "" ||
                              lesson.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((lesson) => (
                            <div
                              key={lesson.id}
                              onClick={() =>
                                handleViewLesson(lesson.id, lesson.title)
                              }
                              className="flex items-center gap-3 px-6 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            >
                              {getContentIcon(lesson.type)}
                              <span>{lesson.title}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* PREVIEW & LESSON INFO */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src="/course-preview.jpg"
                  alt="Course preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* LESSON INFO */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold">
                Select a lesson to start
              </h3>

              {/* META */}
              <div className="mt-1 text-sm text-gray-400 flex gap-4">
                <span>📅 Jan 5, 2026</span>
                <span>⏱ 45 min</span>
                <span>🕒 Updated 2 days ago</span>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-4 text-gray-600 leading-relaxed">
                This lesson will introduce the core concepts and learning
                objectives. You’ll get a clear overview of what to expect, key
                topics covered, and how this lesson fits into the overall course
                structure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
