import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingPosts,
  getAllPosts,
  unpublishPost,
  reviewPost,
} from "../../services/post-service";
import {
  getPromotionRequests,
  markPromotionRequestAsReviewed,
} from "../../services/promotion-service";
import { LoadingState } from "../../components/states/LoadingState";
import { ErrorState } from "../../components/states/ErrorState";
import type { PromotionRequest } from "../../types/promotion";
import { PostStatus } from "../../types/post";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [selectedPromo, setSelectedPromo] = useState<PromotionRequest | null>(
    null,
  );

  const {
    data: pendingPostsData = [],
    isLoading: loadingPending,
    isError: errorPending,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["pending-posts"],
    queryFn: getPendingPosts,
  });

  const {
    data: allPostsData = [],
    isLoading: loadingAll,
    isError: errorAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["all-posts"],
    queryFn: getAllPosts,
  });

  const {
    data: promoRequestsData = [],
    isLoading: loadingPromos,
    isError: errorPromos,
    refetch: refetchPromos,
  } = useQuery({
    queryKey: ["promotion-requests"],
    queryFn: getPromotionRequests,
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => unpublishPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => reviewPost(id, "PUBLISHED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      alert("Post approved and published!");
    },
    onError: (err: any) => {
      console.error("Failed to approve post:", err);
      alert("Failed to approve post. Please try again.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      reviewPost(id, "REJECTED", reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-posts"] });
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      alert("Post rejected.");
    },
    onError: (err: any) => {
      console.error("Failed to reject post:", err);
      alert("Failed to reject post. Please try again.");
    },
  });

  const reviewPromoMutation = useMutation({
    mutationFn: (id: string) => markPromotionRequestAsReviewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotion-requests"] });
      setSelectedPromo(null);
    },
  });

  const isLoading = loadingPending || loadingPromos || loadingAll;
  const isError = errorPending || errorPromos || errorAll;

  const pendingPosts = Array.isArray(pendingPostsData) ? pendingPostsData : [];
  const allPosts = Array.isArray(allPostsData) ? allPostsData : [];
  const promoRequests = Array.isArray(promoRequestsData)
    ? promoRequestsData
    : [];

  const publishedPosts = allPosts.filter(
    (p) => p.status === PostStatus.PUBLISHED,
  );

  if (isLoading) {
    return <LoadingState message="Loading administrative dashboard..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load dashboard data."
        onRetry={() => {
          refetchPending();
          refetchPromos();
          refetchAll();
        }}
      />
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">
          Control center for Aliko Events & Content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Pending
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {pendingPosts.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
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
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Published
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {publishedPosts.length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
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
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Promos
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {promoRequests.filter((r) => r.status !== "REVIEWED").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0a66c2] to-[#004182] p-5 rounded-xl shadow-lg text-white">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">
            Status
          </p>
          <p className="text-lg font-bold mt-1">System Online</p>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Pending Posts */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Pending Approvals
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Author</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingPosts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-10 text-center text-gray-400 text-sm font-medium italic"
                      >
                        All caught up! No pending submissions.
                      </td>
                    </tr>
                  ) : (
                    pendingPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-900 group-hover:text-[#0a66c2] transition text-sm">
                            {post.title}
                          </p>
                          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                            {post.type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 font-medium">
                          {post.createdByName || "Unknown"}
                        </td>
                        <td className="px-5 py-3.5 text-right flex justify-end gap-2">
                          <button
                            onClick={() => {
                              if (
                                window.confirm("Approve and publish this post?")
                              ) {
                                approveMutation.mutate(post.id);
                              }
                            }}
                            disabled={approveMutation.isPending}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = window.prompt(
                                "Reason for rejection:",
                                "Please include a clearer speaker list.",
                              );
                              if (reason !== null) {
                                rejectMutation.mutate({ id: post.id, reason });
                              }
                            }}
                            disabled={rejectMutation.isPending}
                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100 transition border border-red-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Promotion Requests */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Promotion Requests
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {promoRequests.filter((r) => r.status !== "REVIEWED")
                    .length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-10 text-center text-gray-400 text-sm font-medium italic"
                      >
                        No new promotion requests
                      </td>
                    </tr>
                  ) : (
                    promoRequests
                      .filter((r) => r.status !== "REVIEWED")
                      .map((req) => (
                        <tr
                          key={req.id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-5 py-3.5 font-semibold text-gray-900 group-hover:text-purple-600 transition text-sm">
                            {req.companyName}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              {req.type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => setSelectedPromo(req)}
                              className="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition border border-purple-100"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Published Content */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Published Content
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Published On</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {publishedPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-gray-400 text-sm font-medium italic"
                    >
                      No published content found
                    </td>
                  </tr>
                ) : (
                  publishedPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-5 py-3.5 font-semibold text-gray-900 group-hover:text-[#0a66c2] transition text-sm">
                        {post.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                          {post.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 font-medium">
                        {post.publishDate
                          ? new Date(post.publishDate).toLocaleDateString()
                          : "Unknown"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to unpublish this content?",
                              )
                            ) {
                              unpublishMutation.mutate(post.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider transition hover:bg-red-50 px-3 py-1 rounded-lg"
                        >
                          Unpublish
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Promotion Request Detail Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedPromo(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Promotion Request
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Company
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedPromo.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Contact
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedPromo.contactPerson}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="font-semibold text-gray-900 truncate">
                    {selectedPromo.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedPromo.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Requested Type
                </p>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {selectedPromo.type}
                </span>
              </div>

              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Message
                </p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-100">
                  {selectedPromo.message}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => reviewPromoMutation.mutate(selectedPromo.id)}
                disabled={reviewPromoMutation.isPending}
                className="flex-1 py-3 bg-[#0a66c2] text-white rounded-xl font-bold hover:bg-[#004182] transition shadow-md disabled:bg-gray-400"
              >
                {reviewPromoMutation.isPending
                  ? "Processing..."
                  : "Mark as Reviewed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
