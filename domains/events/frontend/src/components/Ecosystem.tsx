import Logo from "../assets/AlikoLogo.svg";

export default function Ecosystem() {
  return (
    <section className="relative py-5  bg-white text-black overflow-hidden">
      {/* Background glow */}
      <div className="bg-white" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-3xl font-semibold mb-20">
          The AlikoHub <span className="text-black">Ecosystem</span>
        </h2>

        {/* Ecosystem Circles */}
        <div className="relative flex items-center  gap-24">
          {/* Academy */}
          <div className="relative z-10 w-44 h-44 rounded-full bg-black/10 border border-black/30 backdrop-blur-md flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🎓</span>
            <span className="font-medium">Academy</span>
          </div>

          {/* Blurry Arrow Line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 w-56 h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent blur-sm" />

          {/* ConTech */}
          <div className="relative z-10 w-44 h-44 rounded-full bg-black/10 border border-black/30 backdrop-blur-md flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🏗️</span>
            <span className="font-medium">ConTech</span>
          </div>
        </div>

        {/* Connector (down) */}
        <div className="relative z-10 w-44 h-44 rounded-full bg-black/10 border border-black/30 backdrop-blur-md flex flex-col items-center justify-center" >AilkoHub</div>
            
        {/* AlikoHub Core */}
        <div className="relative flex  h-44 w-44 flex-col items-center mt-4">{/* Logo container */}
<div className="w-16 h-16 rounded-full bg-black/10 border border-black/30 flex items-center justify-center mb-3">
  <img
    src={Logo}
    alt="AlikoHub Logo"
    className="w-10 h-10 object-contain"
  />
</div>


          <span className="text-lg font-semibold">AlikoHub</span>
        </div>
      </div>
    </section>
  );
}
