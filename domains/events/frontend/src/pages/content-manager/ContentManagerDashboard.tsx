import { useQuery } from '@tanstack/react-query';
import { getMyPosts } from '../../services/post-service';
import { PostStatus, PostType } from '../../types/post';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';
import { EmptyState } from '../../components/states/EmptyState';

export default function ContentManagerDashboard() {
  const { data: posts = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-posts'],
    queryFn: getMyPosts,
  });

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.DRAFT: return 'bg-gray-100 text-gray-800';
      case PostStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case PostStatus.APPROVED: return 'bg-blue-100 text-blue-800';
      case PostStatus.PUBLISHED: return 'bg-green-100 text-green-800';
      case PostStatus.REJECTED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your drafts and track submission status</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center shadow-lg shadow-blue-100 transform active:scale-95">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Post
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white py-20 rounded-2xl shadow-sm border border-gray-100">
          <LoadingState message="Loading your posts..." />
        </div>
      ) : isError ? (
        <div className="bg-white py-20 rounded-2xl shadow-sm border border-gray-100">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState 
          title="No posts yet" 
          message="You haven't created any posts or drafts yet. Start by creating your first post!" 
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${
                        post.type === PostType.EVENT ? 'text-blue-600' : 
                        post.type === PostType.NEWS ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 transition p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
