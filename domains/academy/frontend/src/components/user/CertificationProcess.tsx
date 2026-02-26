import React from "react";
import { Users, Zap, ShieldCheck, ArrowRight } from "lucide-react";

const CertificationProcess = () => {
  const steps = [
    {
      step: "01",
      title: "Enrollment",
      desc: "Submit your application with a brief background assessment. Our admissions team reviews every candidate.",
      icon: <Users size={28} />,
      accent: "#3B82F6",
    },
    {
      step: "02",
      title: "Practical Validation",
      desc: "Complete hands-on projects, peer-reviewed labs, and capstone deliverables graded against industry rubrics.",
      icon: <Zap size={28} />,
      accent: "#10B981",
    },
    {
      step: "03",
      title: "Verified Certification",
      desc: "Earn a blockchain-verified credential recognized by our employer network. Your certificate links directly to your portfolio.",
      icon: <ShieldCheck size={28} />,
      accent: "#F0802D",
    },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-200 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-200 blur-[120px]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F0802D] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-700">
              The Academy Way
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">
            Your Path to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0802D] via-orange-400 to-yellow-400">
              Certification
            </span>
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
            A high-velocity, rigorous journey from initial application to
            industry-standard validation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <div
              key={i}
              className="group relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative h-full bg-white backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <div className="relative">
                      <div
                        className="absolute inset-0 blur-2xl opacity-40"
                        style={{ backgroundColor: item.accent }}
                      />

                      <div
                        className="relative w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-200"
                        style={{
                          background: `linear-gradient(135deg, ${item.accent}33, ${item.accent}11)`,
                        }}
                      >
                        {React.cloneElement(
                          item.icon as React.ReactElement<any>,
                          {
                            style: { color: item.accent },
                          },
                        )}
                      </div>
                    </div>

                    <span className="text-4xl font-black text-slate-200 uppercase italic">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#F0802D] transition-colors flex items-center gap-2">
                    {item.title}

                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#F0802D]" />
                  </h3>

                  <p className="text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div
                  className="mt-8 h-1 w-0 group-hover:w-full transition-all duration-700 rounded-full"
                  style={{
                    backgroundColor: item.accent,
                    boxShadow: `0 0 20px ${item.accent}`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationProcess;
