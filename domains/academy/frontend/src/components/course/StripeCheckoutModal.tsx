import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  price: number;
  onSuccess: () => void;
}

const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  price,
  onSuccess,
}) => {
  const [step, setStep] = useState<
    "checkout" | "processing" | "success" | "failure"
  >("checkout");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("checkout");
      setCardNumber("");
      setExpiry("");
      setCvc("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      // Simulate success 90% of the time for demo
      if (Math.random() > 0.1) {
        setStep("success");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setStep("failure");
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">Secure Checkout</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "checkout" && (
            <div className="space-y-6">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
                  Your Order
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 truncate mr-4">
                    {courseTitle}
                  </h3>
                  <span className="text-xl font-black text-slate-900">
                    ${price.toFixed(2)}
                  </span>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Card Information
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      required
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim()
                            .slice(0, 19),
                        )
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-7 h-4 bg-slate-200 rounded-sm"></div>
                      <div className="w-7 h-4 bg-slate-200 rounded-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      required
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(
                          e.target.value
                            .replace(/\D/g, "")
                            .replace(/(.{2})/, "$1 / ")
                            .trim()
                            .slice(0, 7),
                        )
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      required
                      value={cvc}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Pay ${price.toFixed(2)}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5" />
                  Secure
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5" />
                  Encrypted
                </div>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Processing Payment
              </h3>
              <p className="text-slate-500">
                Please do not close this window while we verify your
                transaction.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-500">
                Welcome to the course. You're being redirected...
              </p>
            </div>
          )}

          {step === "failure" && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Payment Failed
              </h3>
              <p className="text-slate-500 mb-6">
                Something went wrong with your transaction. Please check your
                card details and try again.
              </p>
              <button
                onClick={() => setStep("checkout")}
                className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-center gap-2 border-t border-slate-100 italic text-slate-400 text-[10px]">
          <span>Powered by</span>
          <span className="font-black tracking-tighter text-slate-500 scale-125 ml-1">
            Stripe
          </span>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckoutModal;
