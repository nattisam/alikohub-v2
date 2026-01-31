import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import { 
  FileText, 
  Video, 
  File, 
  ArrowLeft, 
  Clock, 
  Calendar,
  PlayCircle,
  Layout
} from "lucide-react";
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
      setError("");

      const lessonRes = await courseApi.getLesson(id);
      setLesson(lessonRes.data);

      if (lessonRes.data.moduleId) {
        const moduleLessonsRes = await courseApi.getLessons(
          lessonRes.data.moduleId
        );
        setModuleLessons(moduleLessonsRes.data);
      }
    } catch {
      setError("Failed to load lesson content");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!lesson?.contents?.length) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <File size={48} className="mb-4 text-gray-200" />
          <p>No content available for this lesson.</p>
        </div>
      );
    }

    const current = lesson.contents[currentContentIndex];

    switch (current.type) {
      case "VIDEO":
        return (
          <video
            src={current.contentUrl || current.content}
            controls
            className="w-full h-full object-contain"
          />
        );
      case "PDF":
        return (
          <iframe
            src={current.contentUrl || current.content}
            className="w-full h-full border-none"
            title="PDF Viewer"
          />
        );
      case "TEXT":
        return (
          <div
            className="p-8 prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#3E92D1]"
            dangerouslySetInnerHTML={{ __html: current.content || "" }}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center p-12 text-gray-500 italic">
            Unsupported content type
          </div>
        );
    }
  };

  const getContentIcon = (type: string) => {
    if (type === "VIDEO" || type === "WEBINAR") return <Video size={16} />;
    if (type === "PDF") return <FileText size={16} />;
    return <File size={16} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-[#3E92D1] rounded-full" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center max-w-md">
             <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <File size={24} />
             </div>
             <h2 className="text-lg font-bold text-gray-900 mb-2">Lesson Unavailable</h2>
             <p className="text-gray-500 mb-6">{error || "Could not find the requested lesson."}</p>
             <button 
                onClick={() => navigate(-1)}
                className="bg-[#3E92D1] text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-[#327aae] transition-colors"
             >
                Go Back
             </button>
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Navigation */}
        <div className="mb-8">
           <Link
             to={`/student-dashboard/mycourses/${courseId}/modules`}
             className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
           >
             <ArrowLeft size={16} />
             Back to Modules
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Lessons List */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
               <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                     <Layout size={16} className="text-[#3E92D1]" />
                     Module Lessons
                  </h2>
               </div>

               <div className="divide-y divide-gray-50 max-h-[calc(100vh-160px)] overflow-y-auto">
                 {moduleLessons.map((l) => (
                   <button
                     key={l.id}
                     onClick={() =>
                       navigate(
                         `/student-dashboard/mycourses/${courseId}/module/lesson/${l.title
                           .replace(/\s+/g, "-")
                           .toLowerCase()}/${l.id}`
                       )
                     }
                     className={`w-full text-left px-6 py-4 transition-all flex items-center gap-3 ${
                       l.id === lesson.id 
                         ? "bg-blue-50 text-[#3E92D1]" 
                         : "bg-white hover:bg-gray-50 text-gray-600"
                     }`}
                   >
                     <div className={`flex-shrink-0 p-1.5 rounded-md ${l.id === lesson.id ? 'bg-[#3E92D1] text-white' : 'bg-gray-50 text-gray-400'}`}>
                       {l.id === lesson.id ? <PlayCircle size={14} /> : (l.contents && l.contents.length > 0 ? getContentIcon(l.contents[0].type) : getContentIcon(l.type))}
                     </div>
                     <span className={`text-xs font-semibold truncate ${l.id === lesson.id ? 'text-[#3E92D1]' : 'text-gray-700'}`}>
                        {l.title}
                     </span>
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Viewport Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
               {/* Player View */}
               <div className="relative aspect-video bg-gray-900 group flex items-center justify-center">
                  {renderContent()}
               </div>

               {/* Info Section */}
               <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                     <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                     <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-md">
                           <Clock size={14} className="text-[#3E92D1]" />
                           45 min
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-md">
                           <Calendar size={14} className="text-[#3E92D1]" />
                           Updated recently
                        </span>
                     </div>
                  </div>

                  {lesson.description ? (
                    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                       <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About this lesson</h4>
                       <p className="text-gray-600 leading-relaxed text-sm">
                         {lesson.description}
                       </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm">No description available for this lesson.</p>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
