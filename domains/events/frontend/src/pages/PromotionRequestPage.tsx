import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitPromotionRequest } from '../services/promotion-service';
import type { CreatePromotionRequestDto } from '../types/promotion';

export default function PromotionRequestPage() {
  const [formData, setFormData] = useState<CreatePromotionRequestDto>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    promotionType: 'EVENT',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: CreatePromotionRequestDto) => submitPromotionRequest(data),
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo(0, 0);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  /* ================= SUCCESS STATE ================= */
  if (submitted) {
    return (
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2024/02/28/17/16/ai-generated-8602502_1280.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl w-full text-center bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Request Submitted Successfully!
          </h1>

          <p className="text-gray-300 text-lg mb-8">
            Thank you for your interest in promoting with Aliko Events. Our administration team will review your request and contact you via email shortly.
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-violet-500 to-orange-500 text-white px-10 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  /* ================= FORM ================= */
  return (
    <div
      className="relative min-h-screen text-gray-100 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2024/02/28/17/16/ai-generated-8602502_1280.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row">

            {/* ================= SIDEBAR ================= */}
            <div className="md:w-1/3 bg-gradient-to-br from-violet-500 via-purple-600 to-orange-500 p-10 text-white">
              <h2 className="text-3xl font-bold mb-6">Partner With Us</h2>

              <p className="text-white/90 mb-10">
                Reach the AlikoHub community by promoting your event, news, or announcement.
              </p>

              <ul className="space-y-5 text-white/90">
                {['Events promotion', 'Internal news sharing', 'Ecosystem updates'].map(item => (
                  <li key={item} className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-3 text-white/80 drop-shadow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-sm text-white/70">
                  Submissions are manually reviewed by our Communications team.
                </p>
              </div>
            </div>

            {/* ================= FORM ================= */}
            <div className="md:w-2/3 p-10 bg-gray-950/70">
              <h1 className="text-3xl font-bold text-white mb-10">
                Promotion Request Form
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Company Name *', name: 'companyName', placeholder: 'Your Company Ltd.' },
                    { label: 'Contact Person *', name: 'contactPerson', placeholder: 'Jane Doe' },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        required
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                  />
                </div>

                <select
                  name="promotionType"
                  value={formData.promotionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                >
                  <option value="EVENT">Event Promotion</option>
                  <option value="NEWS">News Item</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                </select>

                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the content you'd like to promote..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                />

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`w-full py-4 rounded-xl font-bold text-white transition transform hover:scale-[1.03] active:scale-[0.97] shadow-xl ${
                    mutation.isPending
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-violet-500 via-purple-600 to-orange-500 hover:shadow-orange-400/30'
                  }`}
                >
                  {mutation.isPending ? 'Processing...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
