import type { Post } from "../types/post";

export function PostCard({ post }: { post: Post }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-black rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-900">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {post.excerpt || post.content}
        </p>

        {/* Author & Date */}
        <div className="mt-auto flex items-center justify-between text-gray-400 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-500 border border-blue-500/30">
              {(post.createdByName || "A")[0]}
            </div>
            <span>{post.createdByName || "Admin"}</span>
          </div>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
