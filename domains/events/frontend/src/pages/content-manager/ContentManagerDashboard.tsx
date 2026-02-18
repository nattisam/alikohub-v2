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
    queryFn: getMyPosts,
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
        return "bg-blue-50 text-blue-600";
      case PostStatus.APPROVED:
        return "bg-indigo-50 text-indigo-600";
      case PostStatus.PUBLISHED:
        return "bg-green-50 text-green-600";
      case PostStatus.REJECTED:
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/content-manager/edit/${id}`);
  };

  const handleSubmit = async (id: string) => {
    if (window.confirm("Submit this post for admin review?")) {
      await submitMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Content Management
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Manage and track your publication workflow
            </p>
          </div>
          <button
            onClick={() => navigate("/content-manager/create")}
            className="bg-[#0a66c2] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#004182] transition flex items-center shadow-md shadow-blue-100 text-sm"
          >
            <span className="mr-2 text-lg">+</span> New Post
          </button>
        </header>

        {/* Stats Overview for Content Manager */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <svg
                  className="w-6 h-6"
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
            <p className="text-sm text-gray-500 font-medium">Drafts</p>
            <p className="text-3xl font-bold text-gray-900">
              {posts.filter((p) => p.status === PostStatus.DRAFT).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <svg
                  className="w-6 h-6"
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
            <p className="text-sm text-gray-500 font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-gray-900">
              {posts.filter((p) => p.status === PostStatus.PENDING).length}
            </p>
          </div>

          <div className="bg-[#0a66c2] p-6 rounded-2xl shadow-lg shadow-blue-100 flex flex-col justify-center text-white">
            <div className="p-2 w-fit bg-white/20 rounded-lg mb-3">
              <svg
                className="w-5 h-5 text-white"
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
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
              Published Content
            </p>
            <p className="text-lg font-bold">
              {posts.filter((p) => p.status === PostStatus.PUBLISHED).length}{" "}
              Items
            </p>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Loading your content..." />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            message="Start by creating your first post!"
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  Active Content
                </h2>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  View and manage your recent publication details
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-4">Title</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Created Date</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0a66c2] transition">
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
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0a66c2]" />
                          {post.type}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(post.status)} border border-transparent`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button
                            onClick={() => navigate(`/post/${post.id}`)}
                            className="text-[#0a66c2] hover:text-[#004182] text-xs font-bold uppercase tracking-wider px-3 py-1 hover:bg-blue-50 rounded-full transition"
                          >
                            View
                          </button>
                          {(post.status === PostStatus.DRAFT ||
                            post.status === PostStatus.REJECTED) && (
                            <>
                              <button
                                onClick={() => handleEdit(post.id)}
                                className="p-2 text-gray-400 hover:text-[#0a66c2] hover:bg-blue-50 rounded-full transition-all"
                                title="Edit"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleSubmit(post.id)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                                title="Submit"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  window.confirm("Delete this draft?") &&
                                  deleteMutation.mutate(post.id)
                                }
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Delete"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
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
    </div>
  );
}
