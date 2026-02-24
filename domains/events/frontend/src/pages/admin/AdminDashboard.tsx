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
  const [selectedPostForRejection, setSelectedPostForRejection] = useState<{ id: string; title: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

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
      setSelectedPostForRejection(null);
      setRejectionReason("");
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-md leading-6 font-medium text-gray-900">
                Pending Posts for Review
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {pendingPosts.length} pending post(s) awaiting approval
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingPosts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        All caught up! No pending submissions.
                      </td>
                    </tr>
                  ) : (
                    pendingPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {post.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.createdByName || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                if (
                                  window.confirm("Approve and publish this post?")
                                ) {
                                  approveMutation.mutate(post.id);
                                }
                              }}
                              disabled={approveMutation.isPending}
                              className="bg-emerald-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPostForRejection({ id: post.id, title: post.title });
                                setRejectionReason("Please include a clearer speaker list.");
                              }}
                              disabled={rejectMutation.isPending}
                              className="bg-red-100 text-red-700 px-4 py-1.5 rounded-md text-xs font-medium hover:bg-red-200 transition disabled:opacity-50 border border-red-200"
                            >
                              Reject
                            </button>
                          </div>
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-md leading-6 font-medium text-gray-900">
                Promotion Requests Awaiting Review
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {promoRequests.filter((r) => r.status !== "REVIEWED").length} promotion request(s) pending
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Company
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promoRequests.filter((r) => r.status !== "REVIEWED")
                    .length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No new promotion requests
                      </td>
                    </tr>
                  ) : (
                    promoRequests
                      .filter((r) => r.status !== "REVIEWED")
                      .map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {req.companyName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {req.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedPromo(req)}
                              className="text-purple-600 hover:text-purple-900 px-4 py-1.5 text-xs font-medium rounded-md transition-colors border border-purple-200 hover:bg-purple-50"
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-md leading-6 font-medium text-gray-900">
              Published Posts
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {publishedPosts.length} published post(s) currently active
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Published On
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publishedPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No published content found
                    </td>
                  </tr>
                ) : (
                  publishedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {post.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.publishDate
                          ? new Date(post.publishDate).toLocaleDateString()
                          : "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                          className="text-red-600 hover:text-red-800 px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:bg-red-50"
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
              title="Close"
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

      {/* Rejection Reason Modal */}
      {selectedPostForRejection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => {
                setSelectedPostForRejection(null);
                setRejectionReason("");
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Reject Post
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to reject <span className="font-semibold">{selectedPostForRejection.title}</span>?<br />
              Please provide a reason for rejection (optional):
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm min-h-[120px]"
                placeholder="Enter reason for rejection..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedPostForRejection(null);
                  setRejectionReason("");
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectMutation.mutate({ id: selectedPostForRejection.id, reason: rejectionReason });
                }}
                disabled={rejectMutation.isPending}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:bg-gray-400"
              >
                {rejectMutation.isPending ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
