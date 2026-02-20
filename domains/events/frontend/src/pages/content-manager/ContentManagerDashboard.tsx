import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getMyPosts,
  submitForReview,
  deletePost,
} from "../../services/post-service";
import { PostStatus } from "../../types/post";
import { LoadingState } from "../../components/states/LoadingState";
import { ErrorState } from "../../components/states/ErrorState";
import { EmptyState } from "../../components/states/EmptyState";

export default function ContentManagerDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-posts"],
    queryFn: () => getMyPosts(),
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => submitForReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      alert("Post submitted for review successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.DRAFT:
        return "bg-gray-100 text-gray-600";
      case PostStatus.PENDING:
        return "bg-blue-50 text-blue-600 border-blue-100";
      case PostStatus.APPROVED:
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case PostStatus.PUBLISHED:
        return "bg-green-50 text-green-600 border-green-100";
      case PostStatus.REJECTED:
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleSubmit = async (id: string) => {
    if (window.confirm("Submit this post for admin review?")) {
      await submitMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <LoadingState message="Loading your content..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            Manage and track your publication workflow
          </p>
        </div>
        <button
          onClick={() => navigate("/content-manager/create")}
          className="bg-[#0095DA] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#007bb8] transition flex items-center shadow-md text-sm"
        >
          <span className="mr-2 text-lg">+</span> New Post
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Drafts
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {posts.filter((p) => p.status === PostStatus.DRAFT).length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Pending
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {posts.filter((p) => p.status === PostStatus.PENDING).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0095DA] to-[#007bb8] p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
            Published
          </p>
          <p className="text-2xl font-bold mt-1">
            {posts.filter((p) => p.status === PostStatus.PUBLISHED).length}
          </p>
        </div>
      </div>

      {/* Posts Table */}
      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          message="Start by creating your first post!"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Active Content</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              View and manage your recent publications
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0095DA] transition">
                        {post.title}
                      </p>
                      {post.status === PostStatus.REJECTED &&
                        post.rejectionReason && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-red-500 bg-red-50 w-fit px-2 py-0.5 rounded-full border border-red-100">
                            <span className="font-bold uppercase">
                              Feedback:
                            </span>
                            <span className="italic">
                              {post.rejectionReason}
                            </span>
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0095DA]" />
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => navigate(`/post/${post.id}`)}
                          className="text-[#0095DA] hover:text-[#007bb8] text-xs font-bold uppercase tracking-wider px-3 py-1 hover:bg-blue-50 rounded-lg transition"
                        >
                          View
                        </button>
                        {(post.status === PostStatus.DRAFT ||
                          post.status === PostStatus.REJECTED) && (
                          <>
                            <button
                              onClick={() => handleSubmit(post.id)}
                              className="text-green-600 hover:text-green-700 text-xs font-bold uppercase tracking-wider px-3 py-1 hover:bg-green-50 rounded-lg transition"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() =>
                                window.confirm("Delete this draft?") &&
                                deleteMutation.mutate(post.id)
                              }
                              className="text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-wider px-3 py-1 hover:bg-red-50 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
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
