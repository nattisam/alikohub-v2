import { Link } from "react-router-dom";

function Hero() {

  return (
 <section className="h-screen">
  <div
    className="relative h-screen w-full bg-cover bg-center"
    style={{ backgroundImage: 'url("/images/gathering.png")' }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
      <div className="mx-auto max-w-4xl text-center px-4">
        <h1 className="bg-gradient-to-r from-[#0C69AD] via-[#3FA9F5] to-[#052F4A] bg-clip-text text-4xl font-extrabold text-transparent md:text-6xl">
          Connecting Africa to Global Opportunities Through Impactful Events
        </h1>

        <p className="mx-auto mt-4 max-w-xl sm:text-xl text-[#3FA9F5] font-bold">
          Join us and embark on your next extraordinary adventure!
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            className="rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white"
            to="/events"
          >
            Upcoming Events
          </Link>

          <Link
            className="rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600"
            to="/news"
          >
            News
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

  );
}

export default Hero;
