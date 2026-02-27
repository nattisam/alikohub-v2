import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AcademyPartnershipPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-20 bg-white selection:bg-[#17469E] selection:text-white">
      {/* Hero / Landing Section */}
      <section className="py-24 px-6 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F0802D] block mb-4">
            How to Engage
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#17469E] leading-tight">
            Partnership Options
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Multiple pathways to support and collaborate with AlikoHub.
          </p>
        </div>
      </section>

      {/* Engagement / Contact Section - Refactored to match image UI */}
      <section className="bg-[#F8FAFC] py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header Text from Image */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4">
              Contact Us
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#17469E] to-[#F0802D] mx-auto mb-6"></div>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Have questions or want to discuss potential partnerships? Our team
              is ready to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl rounded-[2rem] overflow-hidden bg-white border border-gray-100">
            {/* Left Panel: "Get in Touch" (Styled like image sidebar) */}
            <div className="lg:col-span-4 bg-[#17469E] p-10 md:p-12 text-white flex flex-col justify-between">
              <div className="space-y-10">
                <h3 className="text-2xl font-black tracking-tight">
                  Get in Touch
                </h3>

                <div className="space-y-8">
                  {/* Visit Us */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <MapPin className="w-5 h-5 text-[#F0802D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-1">
                        Visit Us
                      </h4>
                      <p className="text-sm leading-relaxed font-medium">
                        Bole Road Tigis building
                        <br />
                        12 floor, Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>

                  {/* Call Us */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <Phone className="w-5 h-5 text-[#F0802D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-1">
                        Call Us
                      </h4>
                      <p className="text-sm font-medium">
                        +251 911 111 111 | +251 900 222 222
                      </p>
                    </div>
                  </div>

                  {/* Email Us */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <Mail className="w-5 h-5 text-[#F0802D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-1">
                        Email Us
                      </h4>
                      <p className="text-sm font-medium">info@alikohub.com</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <Clock className="w-5 h-5 text-[#F0802D]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-1">
                        Working Hours
                      </h4>
                      <p className="text-sm font-medium">
                        Mon-Fri: 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: "Send a Message" Form */}
            <div className="lg:col-span-8 p-10 md:p-16">
              <h3 className="text-2xl font-black text-[#111827] mb-8">
                Send a Message
              </h3>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#17469E]/20 focus:border-[#17469E] transition-all placeholder:text-gray-300"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#17469E]/20 focus:border-[#17469E] transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold uppercase tracking-widest text-gray-400"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Please provide details about your inquiry..."
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#17469E]/20 focus:border-[#17469E] transition-all placeholder:text-gray-300 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#17469E] hover:bg-[#F0802D] text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/10 active:scale-[0.99]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AcademyPartnershipPage;
