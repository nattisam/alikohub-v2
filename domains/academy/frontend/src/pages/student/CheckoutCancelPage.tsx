import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

const CheckoutCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("courseId");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="h-4 bg-rose-500 w-full"></div>

          <div className="p-10 text-center">
            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in bounce-in duration-700">
              <XCircle className="w-12 h-12 text-rose-600" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-4">
              Checkout Cancelled
            </h1>

            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Your payment process was cancelled and no charges were made.
            </p>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 text-left mb-10 flex gap-4">
              <HelpCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-amber-800 text-sm mb-1">
                  Need help?
                </h3>
                <p className="text-xs text-amber-700">
                  If you encountered any technical issues during checkout,
                  please contact our support team or try again later.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() =>
                  courseId ? navigate(`/courses/${courseId}`) : navigate("/")
                }
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Course Page
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Return Home
              </button>
            </div>
          </div>

          <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              You can resume your checkout at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;
