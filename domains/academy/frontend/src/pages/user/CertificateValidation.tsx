import React from "react";
import { Globe, ShieldCheck, CheckCircle2 } from "lucide-react";

const CertificateValidation: React.FC = () => {
  const brandColor = "text-[#17469E]";
  const brandSecondary = "#F0802D";

  const validationCards = [
    {
      title: "Portfolio-Ready Capstones",
      items: [
        "Real-world project briefs sourced from industry partners",
        "Code repositories and documentation reviewed by mentors",
        "Presentation-ready deliverables for interviews",
      ],
    },
    {
      title: "Employer Validation",
      items: [
        "Credentials verified on-chain and employer-accessible",
        "Skills mapping aligned with major job boards",
        "Direct referral pipeline to 50+ hiring partners",
      ],
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Text Content */}
          <div className="relative">
            <span
              className={`text-[10px] font-black uppercase tracking-[0.3em] ${brandColor} mb-4 block`}
            >
              Validation
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1]">
              Proof That{" "}
              <span style={{ color: brandSecondary }}>Goes Beyond</span> a
              Certificate
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-xl">
              Our verification model ensures every graduate carries tangible,
              employer-trusted proof of competency. We don't just teach; we
              validate potential through real-world application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="group space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#17469E] transition-transform group-hover:scale-110 duration-300">
                  <Globe size={28} />
                </div>
                <h4 className="font-black text-gray-900 text-lg">
                  Global Recognition
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Accepted by leading companies across the globe, ensuring your
                  skills are understood in any market.
                </p>
              </div>

              <div className="group space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F0802D] transition-transform group-hover:scale-110 duration-300">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="font-black text-gray-900 text-lg">
                  Trust Guarantee
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every certification is backed by rigorous assessment and
                  multi-layer verification protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Feature Cards */}
          <div className="space-y-8 relative">
            {/* Decorative background element */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#17469E]/5 rounded-full blur-3xl" />

            {validationCards.map((card, i) => (
              <div
                key={i}
                className="group bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/60 hover:shadow-orange-500/5 transition-all duration-500 relative z-10"
              >
                <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-[#17469E] transition-colors">
                  {card.title}
                </h3>
                <ul className="space-y-5">
                  {card.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex gap-4 text-gray-600 font-medium leading-relaxed"
                    >
                      <div
                        className="mt-1 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${brandSecondary}15` }}
                      >
                        <CheckCircle2
                          size={14}
                          style={{ color: brandSecondary }}
                          strokeWidth={3}
                        />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateValidation;
