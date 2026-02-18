import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPublishedPosts } from "../services/post-service";
import { PostType } from "../types/post";
import { ArrowRight } from "lucide-react";
import { LoadingState } from "../components/states/LoadingState";
import { ErrorState } from "../components/states/ErrorState";

export default function NewsPage() {
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["published-posts", "news-and-announcements"],
    queryFn: async () => {
      const allPosts = await getAllPublishedPosts();
      return allPosts.filter(
        (p) => p.type === PostType.NEWS || p.type === PostType.ANNOUNCEMENT,
      );
    },
  });

  const typeColors: Record<string, string> = {
    NEWS: "bg-blue-600 text-white",
    ANNOUNCEMENT: "bg-purple-600 text-white",
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-screen text-white"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/935732546/photo/background-of-glowing-abstract-lines-and-spheres.jpg?s=1024x1024&w=is&k=20&c=9IRPAamDgvs-0oR1Y7SP3XQhw6qI0kqKivbGrV8Lz9Y=')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Header */}
      <div className="relative container mx-auto text-center px-4 py-16 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          News & <span className="text-blue-400">Announcements</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Stay updated with the latest news and important announcements from the
          AlikoHub ecosystem.
        </p>
      </div>

      {/* News Feed */}
      <div className="relative container mx-auto px-4 py-4 z-10">
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          {isLoading ? (
            <LoadingState message="Loading updates..." />
          ) : isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-white/5">
              <p className="text-gray-400 text-xl font-medium">
                No news or announcements yet.
              </p>
            </div>
          ) : (
            posts.map((post, index) => (
              <article
                key={post.id}
                className={`flex flex-col md:flex-row gap-8 p-8 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl transition-all hover:bg-gray-900/80 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="w-full md:w-2/5 h-64 md:h-80 rounded-2xl overflow-hidden shadow-inner bg-gray-800 flex-shrink-0">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <svg
                        className="w-20 h-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-sm ${
                        typeColors[post.type] ?? "bg-gray-600"
                      }`}
                    >
                      {post.type}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight text-white group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-300 text-lg mb-6 leading-relaxed line-clamp-3">
                    {post.shortDescription}
                  </p>

                  {/* Expanded content */}
                  {openPostId === post.id && (
                    <div className="mb-6 p-6 bg-gray-950/50 backdrop-blur-sm border border-white/5 rounded-2xl text-gray-300 leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
                      {post.content.split("\n").map((para, i) => (
                        <p key={i} className="mb-4 last:mb-0">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setOpenPostId(openPostId === post.id ? null : post.id)
                    }
                    className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all group"
                  >
                    {openPostId === post.id ? "Show less" : "Read Full Story"}
                    <ArrowRight
                      size={18}
                      className={`transition-transform flex-shrink-0 ${
                        openPostId === post.id
                          ? "-rotate-90"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
