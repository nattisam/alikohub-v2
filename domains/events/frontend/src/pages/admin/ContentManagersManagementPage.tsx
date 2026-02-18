import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getContentManagers,
  createContentManager,
  updateContentManager,
  deleteContentManager,
} from "../../services/user-service";
import type { CreateContentManagerDto } from "../../services/user-service";
import { LoadingState } from "../../components/states/LoadingState";
import { ErrorState } from "../../components/states/ErrorState";

export default function ContentManagersManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<CreateContentManagerDto>({
    name: "",
    email: "",
    password: "",
  });

  const {
    data: managers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["content-managers"],
    queryFn: getContentManagers,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateContentManagerDto) => createContentManager(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-managers"] });
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "DISABLED";
    }) => updateContentManager(id, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["content-managers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContentManager(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["content-managers"] }),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
  };

  if (isLoading)
    return (
      <div className="py-20">
        <LoadingState message="Loading staff accounts..." />
      </div>
    );
  if (isError)
    return (
      <div className="py-20">
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
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
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Content Managers
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Manage AlikoHub internal staff access
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0a66c2] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#004182] transition flex items-center shadow-md shadow-blue-100"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add Staff Member
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">Staff Member</th>
                  <th className="px-8 py-4">Email</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {managers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-20 text-center text-gray-400 text-sm font-medium italic"
                    >
                      No staff accounts found
                    </td>
                  </tr>
                ) : (
                  managers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0a66c2] font-bold text-xs mr-3 border border-blue-100">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#0a66c2] transition text-sm">
                            {user.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        {user.email}
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            user.status === "ACTIVE"
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right space-x-1">
                        <button
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: user.id,
                              status:
                                user.status === "ACTIVE"
                                  ? "DISABLED"
                                  : "ACTIVE",
                            })
                          }
                          className="p-2 text-gray-400 hover:text-[#0a66c2] hover:bg-blue-50 rounded-full transition-all"
                          title={
                            user.status === "ACTIVE"
                              ? "Disable Account"
                              : "Enable Account"
                          }
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
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(`Permanently remove ${user.name}?`)
                            ) {
                              deleteMutation.mutate(user.id);
                            }
                          }}
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Manager Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setShowAddModal(false)}
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
                New Staff Account
              </h3>
              <p className="text-gray-500 mb-8 font-medium text-sm">
                Create credentials for a content manager.
              </p>

              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-[#0a66c2] outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@alikohub.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-[#0a66c2] outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-[#0a66c2] outline-none transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full py-3 bg-[#0a66c2] text-white rounded-full font-bold hover:bg-[#004182] transition shadow-md shadow-blue-100 disabled:bg-gray-400 mt-4 text-sm"
                >
                  {createMutation.isPending
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
