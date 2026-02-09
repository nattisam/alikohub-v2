// PostList.tsx
import type { Post } from '../types/post';
import { PostCard } from './PostCard';
import { LoadingState } from './states/LoadingState';
import { EmptyState } from './states/EmptyState';
import { ErrorState } from './states/ErrorState';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  onRetry?: () => void;
  emptyMessage?: string;
  loadingMessage?: string;
}

export function PostList({ 
  posts, 
  isLoading, 
  isError, 
  error, 
  onRetry, 
  emptyMessage = "No content available at the moment.",
  loadingMessage = "Discovering the latest updates..."
}: PostListProps) {
  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (isError) return <ErrorState error={error} onRetry={onRetry} />;
  if (posts.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="max-w-3xl mx-auto divide-y divide-gray-200">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
