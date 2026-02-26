import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Play, Award, Loader2 } from "lucide-react";
import { enrollmentApi } from "../../api/enrollmentApi";
import { courseApi } from "../../api/courseApi";
import type { Course } from "../../components/common/types.d";

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("courseId");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const response = await courseApi.getCourse(parseInt(courseId));
          setCourse(response.data);

          // Automatically enroll after successful payment if not already enrolled
          await enrollmentApi.createEnrollment({
            courseId: parseInt(courseId),
          });
        } catch (error: any) {
          console.error("Error fetching course or enrolling:", error);
          setError(
            error.response?.data?.message ||
              "Failed to confirm enrollment. Please contact support.",
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">
          Confirming your enrollment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 text-center shadow-xl border border-rose-100">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-rose-500 opacity-20" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Enrollment Error
          </h1>
          <p className="text-slate-500 mb-8">{error}</p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="h-4 bg-emerald-500 w-full"></div>

          <div className="p-10 text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in bounce-in duration-700">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-4">
              Payment Successful!
            </h1>

            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Congratulations! You are now officially enrolled in <br />
              <span className="font-bold text-slate-800">
                {course?.title || "your new course"}
              </span>
              .
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Play className="w-5 h-5 text-indigo-600 fill-current" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  Start Learning
                </h3>
                <p className="text-xs text-slate-500">
                  Access all video lessons and modules immediately.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  Get Certified
                </h3>
                <p className="text-xs text-slate-500">
                  Get a professional certificate upon completion.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() =>
                  navigate(`/student-dashboard/course/${courseId}`)
                }
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
              >
                Go to My Lesson
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/student-dashboard")}
                className="w-full py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              A confirmation email has been sent to your registered email
              address.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          Powered by AlikoHub Academy
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
