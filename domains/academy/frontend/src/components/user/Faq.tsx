const Faq = () => {
  return (
    <main className="bg-[#F8F6CC] min-h-screen flex flex-col items-center py-10 px-4 lg:ml-15 lg:mr-15">
      <section className="w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Frequently asked questions
        </h1>

        <div className="border border-[#667085] p-4 mb-4 rounded flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-[#101828]">
            Is there a free trial available?
          </h2>
          <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 text-lg font-bold">
            −
          </div>
        </div>

        <div className="border border-[#667085] p-4 mb-4 rounded">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold text-[#101828]">
              Can I change my plan later?
            </h2>
            <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 text-lg font-bold">
              +
            </div>
          </div>
          <h2 className="text-[#667085] text-base font-normal mt-2">
            Yes, you can try us for free for 30 days. If you want, we’ll provide
            you with a free, personalized 30-minute onboarding call to get you
            up and running as soon as possible.
          </h2>
        </div>

        {[
          "What is your cancellation policy?",
          "Can other info be added to an invoice?",
          "How does billing work?",
          "How do I change my account email?",
        ].map((question, index) => (
          <div
            key={index}
            className="border border-[#667085] p-4 mb-4 rounded flex justify-between items-center"
          >
            <h2 className="text-lg md:text-xl font-semibold text-[#101828]">
              {question}
            </h2>
            <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 text-lg font-bold">
              +
            </div>
          </div>
        ))}

        <div className="text-center mt-10">
          <h2 className="text-lg md:text-xl font-semibold text-[#101828] mb-4">
            Still have questions?
          </h2>
          <button className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black px-6 py-2 rounded-full hover:bg-[#E6D600] transition">
            Get in touch
          </button>
        </div>
      </section>
    </main>
  );
};

export default Faq;
