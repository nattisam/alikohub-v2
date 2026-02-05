import { ArrowRight } from 'lucide-react';
import { Countdown } from './Countdown';

export default function Hero() {
  return (
    <section
      className="relative text-center min-h-[420px] text-white bg-cover bg-center overflow-visible"
      style={{
        backgroundImage: "url('/images/gathering.png')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* content */}
      <div className="relative z-10 pt-16">
        <span className="text-xs font-semibold bg-gradient-to-r from-violet-500 to-orange-500 px-4 py-1 rounded-full shadow-lg inline-block">
  LAGOS 2026
</span>


        <h1 className="mt-6 text-5xl font-bold">
          Africa Tech{" "}
          <span className="text-blue-500 block">Summit 2026</span>
        </h1>

        <Countdown />

        <div className="flex justify-center gap-4">
          <button className="flex items-center mt-10 mb-10 gap-2 px-4 py-3 rounded-full bg-gray-500 hover:bg-blue-700 transition-colors duration-300">
            Register Now <ArrowRight size={16} />
          </button>

          <button className="px-6 py-3 rounded-full mb-10 mt-10 border border-gray-500 hover:border-white transition">
            View Schedule
          </button>
        </div>
      </div>

      {/* 🔥 floating person image */}
      <img
  src="https://i.pinimg.com/736x/1f/87/cb/1f87cb6b07a72b15e0ccac38ea774e58.jpg"
  alt="speaker"
  className="
    absolute
    right-10
    bottom-[-60px]
    w-[280px]
    z-20
    drop-shadow-2xl
    rounded-xl
    animate-float
  "
/>

    </section>
  );
}