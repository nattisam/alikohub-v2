import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Hero from "../components/Hero";
import { getAllPublishedPosts } from "../services/post-service";
import UpcomingEvents from "../components/UpcomingEvents";
import Ecosystem from "../components/Ecosystem";

export default function HomePage() {
  const navigate = useNavigate();

  useQuery({
    queryKey: ["published-posts", "home"],
    queryFn: getAllPublishedPosts,
  });

  return (
    <div
      className="relative min-h-screen text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2024/02/28/17/16/ai-generated-8602502_1280.jpg')",
      }}
    >
      {/* overlay for readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      {/* content wrapper */}
      <div className="relative z-10">
        <Hero />
        <UpcomingEvents />
        <Ecosystem />

        {/* Promotion Call to Action */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div
              className="rounded-[3rem] p-8 md:p-16 
            flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-blue-900/40 bg-gray-900/70 backdrop-blur-xl"
            >
              <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Want to promote your content?
                </h2>
                <p className="text-blue-100 text-lg md:text-xl max-w-xl">
                  External companies can request to publish events or
                  announcements on our platform.
                </p>
              </div>

              <button
                onClick={() => navigate("/promotion-request")}
                className="bg-white text-blue-700 px-10 py-5 rounded-2xl
                 text-xl font-black hover:bg-gray-200 transition shadow-xl transform active:scale-95"
              >
                Submit Request
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
