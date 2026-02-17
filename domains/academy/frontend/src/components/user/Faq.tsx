import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try us for free for 30 days. We’ll also provide a free, personalized 30-minute onboarding call to get you started quickly.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time directly from your account settings.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "You can cancel your subscription anytime. No hidden fees, and access will remain until the end of your billing period.",
    },
    {
      question: "Can other info be added to an invoice?",
      answer:
        "Yes, you can include company details, purchase order numbers, or any custom notes when generating invoices.",
    },
    {
      question: "How does billing work?",
      answer:
        "Billing is automated monthly or yearly depending on your subscription. You can view and download receipts anytime.",
    },
    {
      question: "How do I change my account email?",
      answer:
        "You can update your email from your profile settings. A confirmation link will be sent to verify the change.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 min-h-screen flex flex-col items-center py-10 px-4 lg:px-20">
      <section className="w-full max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#17469E]">
          Frequently Asked Questions
        </h1>

        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition"
              >
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 text-left">
                  {item.question}
                </h2>
                <span className="text-gray-500 text-2xl flex items-center">
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 bg-gray-50 text-gray-600 text-base md:text-base">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}

        <div className="text-center mt-12">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-3 bg-[#0095DA] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Get in touch
          </button>
        </div>
      </section>
    </main>
  );
};

export default Faq;
