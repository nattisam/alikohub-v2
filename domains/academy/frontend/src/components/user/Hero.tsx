const Hero = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-x-hidden">
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f0f9ff_0%,transparent_55%)]" />

        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-sky-50 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-50 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">{children}</div>
    </div>
  );
};

export default Hero;
