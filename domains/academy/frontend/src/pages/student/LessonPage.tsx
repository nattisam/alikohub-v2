import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import { FaFile, FaVideo, FaFilePdf } from "react-icons/fa";
import type { Lesson } from "../../components/common/types";

const LessonPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const lessonIdNum = Number(lessonId);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentContentIndex] = useState(0);

  useEffect(() => {
    if (lessonIdNum) fetchLesson(lessonIdNum);
  }, [lessonIdNum]);

  const fetchLesson = async (id: number) => {
    try {
      setLoading(true);

      const lessonRes = await courseApi.getLesson(id);
      setLesson(lessonRes.data);

      // fetch lessons of the SAME module
      if (lessonRes.data.moduleId) {
        const moduleLessonsRes = await courseApi.getLessons(
          lessonRes.data.moduleId
        );
        setModuleLessons(moduleLessonsRes.data);
      }
    } catch {
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!lesson?.contents?.length) {
      return (
        <p className="text-gray-500 text-center py-12">No content available.</p>
      );
    }

    const current = lesson.contents[currentContentIndex];

    switch (current.type) {
      case "VIDEO":
        return (
          <video
            src={current.contentUrl || current.content}
            controls
            className="w-full rounded-lg max-h-[420px]"
          />
        );
      case "PDF":
        return (
          <iframe
            src={current.contentUrl || current.content}
            className="w-full h-[420px] rounded-lg"
            title="PDF"
          />
        );
      case "TEXT":
        return (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: current.content || "" }}
          />
        );
      default:
        return <p className="text-gray-600">Unsupported content</p>;
    }
  };

  const getContentIcon = (type: string) => {
    if (type === "VIDEO") return <FaVideo className="text-red-500" />;
    if (type === "WEBINAR") return <FaVideo className="text-red-500" />;
    if (type === "PDF") return <FaFilePdf className="text-red-600" />;
    return <FaFile className="text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error || !lesson) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BACK */}
        <Link
          to={`/student-dashboard/mycourses/${courseId}/modules`}
          className="text-blue-600 hover:underline mb-6 inline-block flex items-center"
        >
          <span className="mr-2">←</span> Back to Modules
        </Link>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: LESSON LIST */}
          <div className="bg-white rounded-xl shadow">
            <h2 className="px-4 py-3 font-semibold border-b border-gray-200 text-gray-800">Lessons</h2>

            <div className="divide-y divide-gray-100">
              {moduleLessons.map((l) => (
                <div
                  key={l.id}
                  onClick={() =>
                    navigate(
                      `/student-dashboard/mycourses/${courseId}/module/lesson/${l.title
                        .replace(/\s+/g, "-")
                        .toLowerCase()}/${l.id}`
                    )
                  }
                  className={`px-4 py-3 cursor-pointer text-sm transition-colors duration-200 flex items-center gap-3 ${
                    l.id === lesson.id 
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {l.contents && l.contents.length > 0 ? getContentIcon(l.contents[0].type) : getContentIcon(l.type)}
                  </div>
                  <span className="truncate">{l.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* PLAYER */}
            <div className="bg-white rounded-xl shadow">
              <div className="aspect-video bg-black rounded-lg overflow-hidden p-2">
                {renderContent()}
              </div>
            </div>

            {/* LESSON INFO */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>

              <div className="mt-2 text-sm text-gray-500 flex gap-4">
                <span className="flex items-center gap-1">
                  <span>⏱</span> 45 min
                </span>
                <span className="flex items-center gap-1">
                  <span>📅</span> Updated recently
                </span>
              </div>

              {lesson.description && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
