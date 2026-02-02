import { ArrowRight } from 'lucide-react';
import { Countdown } from './Countdown';

export default function Hero() {
  return (
    <section
      className="relative text-center min-h-[300px] text-white bg-cover "
      style={{
        backgroundImage: "url('/images/gathering.png')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 " />

      <div className="relative z-10">
        <span className="text-xs bg-blue-900/40">
          LAGOS 2026
        </span>

        <h1 className="mt-6 text-5xl font-bold">
          Africa Tech <span className="text-blue-500 mb-15"><h1>Summit 2026</h1></span>
        </h1>

        <Countdown />

        <div className="flex justify-center gap-4">
          <button className="flex items-center mt-10 mb-10 gap-2 px-4 py-3 rounded-full 
          bg-gray-500 hover:bg-blue-700 transition-colors duration-300">
            Register Now <ArrowRight size={16} />
          </button>
          <button className="px-6 py-3 rounded-full mb-10 mt-10 border border-gray-500 hover:border-white transition">
            View Schedule
          </button>
        </div>
      </div>
    </section>
  );
}
