import Logo from "../assets/AlikoLogo.svg";

export default function Ecosystem() {
  return (
    <section
      className="relative text-white overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2024/02/28/17/16/ai-generated-8602502_1280.jpg')",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      {/* Constrained Container */}
      <div className="relative max-w-4xl mx-auto px-4 py-10 flex flex-col items-center z-10">
        {/* Title */}
        <h2 className="text-3xl md:text-3xl font-bold mb-8 text-center">
          The AlikoHub <span className="text-blue-400">Ecosystem</span>
        </h2>

        {/* Top Circles */}
        <div className="relative flex flex-col md:flex-row items-center gap-10">
          {/* Academy */}
          <div
            className="w-28 h-28 rounded-full bg-blue-800/30 border border-blue-400 backdrop-blur-md
                       flex flex-col items-center justify-center
                       animate-float animate-pulseGlow
                       hover:scale-110 transition-all duration-300"
          >
            <span className="text-2xl mb-1">🎓</span>
            <span className="text-sm font-medium">Academy</span>
          </div>

          {/* Connector */}
          <div
            className="absolute hidden md:block top-1/2 left-1/2 w-40 h-[2px]
                       bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
          />

          {/* ConTech */}
          <div
            className="w-28 h-28 rounded-full bg-blue-800/30 border border-blue-400 backdrop-blur-md
                       flex flex-col items-center justify-center
                       animate-float animate-pulseGlow
                       hover:scale-110 transition-all duration-300"
          >
            <span className="text-2xl mb-1">🏗️</span>
            <span className="text-sm font-medium">ConTech</span>
          </div>
        </div>

        {/* Connector Circle */}
        <div
          className="relative w-28 h-28 rounded-full bg-blue-800/30 border border-blue-400 backdrop-blur-md
                     flex flex-col items-center justify-center mt-6
                     animate-float hover:scale-110 transition-all duration-300"
        >
          <span className="text-sm font-semibold">AlikoHub</span>

          <div className="absolute -top-6 left-1/4 w-[2px] h-6 bg-blue-400/60" />
          <div className="absolute -top-6 right-1/4 w-[2px] h-6 bg-blue-400/60" />
        </div>

        {/* Core Logo */}
        <div className="mt-6 flex flex-col items-center animate-float">
          <div
            className="w-10 h-10 rounded-full bg-blue-800/40 border border-blue-400
                       flex items-center justify-center shadow-lg
                       hover:scale-110 transition-all"
          >
            <img src={Logo} alt="AlikoHub Logo" className="w-6 h-6" />
          </div>
          <span className="mt-1 text-sm font-semibold">AlikoHub</span>
        </div>
      </div>
    </section>
  );
}
