import type { Post } from '../types/post';

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-black rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
        <p className="text-white text-sm mb-4 line-clamp-3">{post.content}</p>

        {/* Author & Date */}
        <div className="mt-auto flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{post.author.name}</span>
          </div>
          <span>{post.createdAt}</span>
        </div>
      </div>
    </div>
  );
}
