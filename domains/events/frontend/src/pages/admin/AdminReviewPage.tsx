import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostById,
  approvePost,
  rejectPost,
  updateDraft,
} from "../../services/post-service";
import { PostType } from "../../types/post";
import type { UpdatePostDto } from "../../types/post";
import { LoadingState } from "../../components/states/LoadingState";
import { ErrorState } from "../../components/states/ErrorState";
import PostForm from "../../components/content/PostForm";

export default function AdminReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => approvePost(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate("/admin");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (feedback: string) => rejectPost(id as string, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate("/admin");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePostDto) => updateDraft(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      setIsEditing(false);
    },
  });

  const handleApprove = async () => {
    if (
      window.confirm("Are you sure you want to approve and publish this post?")
    ) {
      await approveMutation.mutateAsync();
    }
  };

  const handleReject = async () => {
    if (!rejectionFeedback.trim()) {
      alert("Please provide feedback for rejection.");
      return;
    }
    await rejectMutation.mutateAsync(rejectionFeedback);
  };

  if (isLoading)
    return (
      <div className="py-20">
        <LoadingState message="Loading submission details..." />
      </div>
    );
  if (isError)
    return (
      <div className="py-20">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  if (!post) return <div className="py-20 text-center">Post not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="text-[#0a66c2] font-semibold flex items-center mb-4 hover:underline text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Review Submission
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Submitted by{" "}
            <span className="font-semibold text-gray-900">
              {post.createdByName}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition text-sm shadow-sm"
              >
                Edit & Refine
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-5 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition text-sm border border-red-100"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="px-5 py-2 bg-[#0a66c2] text-white rounded-xl font-bold hover:bg-[#004182] transition shadow-md shadow-blue-100 disabled:bg-gray-400 text-sm"
              >
                Approve & Publish
              </button>
            </>
          )}
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <PostForm
          initialData={post}
          onSubmit={async (data) => {
            await updateMutation.mutateAsync(data);
          }}
          isLoading={updateMutation.isPending}
          buttonText="Save Improvements"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {post.coverImage && (
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 aspect-video bg-white">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    post.type === PostType.EVENT
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : post.type === PostType.NEWS
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-purple-50 text-purple-700 border border-purple-100"
                  }`}
                >
                  {post.type}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500 font-medium">
                  Created {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                {post.title}
              </h2>
              <p className="text-lg text-gray-500 font-semibold mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {post.content.split("\n").map((para, i) => (
                  <p key={i} className="mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {post.type === PostType.EVENT && (
              <div className="bg-gradient-to-br from-[#0a66c2] to-[#004182] p-6 rounded-xl text-white shadow-xl">
                <h3 className="text-lg font-bold mb-5 flex items-center border-b border-white/20 pb-3">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Event Info
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Date & Time
                    </p>
                    <p className="text-lg font-bold">
                      {post.eventDate} at {post.startTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      Location
                    </p>
                    <p className="text-lg font-bold">{post.location}</p>
                  </div>
                  {post.externalLink && (
                    <div>
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        Join Link
                      </p>
                      <a
                        href={post.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-100 underline font-bold break-all transition-colors"
                      >
                        {post.externalLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                Post Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Status</span>
                  <span className="font-bold text-[#0a66c2] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">
                    {post.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-3">
                  <span className="text-gray-500 font-medium">Author ID</span>
                  <span className="font-mono text-gray-400">
                    {post.createdBy?.slice(0, 8) || "N/A"}...
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-gray-50 pt-3">
                  <span className="text-gray-500 font-medium">Ref</span>
                  <span className="font-mono text-gray-300">
                    {post.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Reject Submission
            </h3>
            <p className="text-gray-600 mb-6 font-medium">
              Please let the content manager know what needs to be fixed.
            </p>

            <textarea
              className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition mb-6 resize-none"
              placeholder="Feedback for the author..."
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
