import { useQuery } from '@tanstack/react-query';
import { getPendingPosts } from '../../services/post-service';
import { getPromotionRequests } from '../../services/promotion-service';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function AdminDashboard() {
  const { 
    data: pendingPosts = [], 
    isLoading: loadingPosts,
    isError: errorPosts,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['pending-posts'],
    queryFn: getPendingPosts,
  });

  const { 
    data: promoRequests = [], 
    isLoading: loadingPromos,
    isError: errorPromos,
    refetch: refetchPromos
  } = useQuery({
    queryKey: ['promotion-requests'],
    queryFn: getPromotionRequests,
  });

  const isLoading = loadingPosts || loadingPromos;
  const isError = errorPosts || errorPromos;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <LoadingState message="Loading administrative dashboard..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20">
        <ErrorState 
          message="Failed to load dashboard data." 
          onRetry={() => {
            refetchPosts();
            refetchPromos();
          }} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Review content submissions and promotion requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Pending Approvals</p>
          <p className="text-4xl font-black text-blue-600">{pendingPosts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Promotion Requests</p>
          <p className="text-4xl font-black text-purple-600">{promoRequests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <button className="h-full w-full bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center p-4">
                Manage Content Managers
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Pending Posts Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingPosts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">No pending submissions</td>
                    </tr>
                  ) : (
                    pendingPosts.map(post => (
                      <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{post.title}</p>
                          <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{post.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{post.createdByName || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition">Review</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Promotion Requests Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Promotion Requests</h2>
            <button className="text-purple-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {promoRequests.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">No promotion requests</td>
                    </tr>
                  ) : (
                    promoRequests.map(req => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{req.companyName}</td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                            {req.promotionType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 transition">Details</button>
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
    </div>
  );
}
