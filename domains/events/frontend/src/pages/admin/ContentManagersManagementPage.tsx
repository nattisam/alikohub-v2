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
            Content Managers
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Manage AlikoHub internal staff access
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0a66c2] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#004182] transition flex items-center shadow-md text-sm"
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
          Add Staff
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-md leading-6 font-medium text-gray-900">
            Content Manager Accounts
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {managers.length} staff account(s) currently managed
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
                  Staff Member
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {managers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No staff accounts found
                  </td>
                </tr>
              ) : (
                managers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0a66c2] font-bold text-xs mr-3 border border-blue-100">
                          {(user.name || user.email || "U")
                            .toString()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#0a66c2] transition text-sm">
                          {user.name || user.email || "Unknown User"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || "No email"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                          (user.status || "UNKNOWN") === "ACTIVE"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {user.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: user.id,
                              status:
                                (user.status || "UNKNOWN") === "ACTIVE" ? "DISABLED" : "ACTIVE",
                            })
                          }
                          className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#0a66c2] hover:bg-blue-50 px-3 py-1 rounded-lg transition border border-gray-200"
                        >
                          {(user.status || "UNKNOWN") === "ACTIVE" ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(`Permanently remove ${user.name || user.email || 'this user'}?`)
                            ) {
                              deleteMutation.mutate(user.id);
                            }
                          }}
                          className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg transition border border-red-200"
                        >
                          Delete
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

      {/* Add Manager Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                className="w-full py-3 bg-[#0a66c2] text-white rounded-xl font-bold hover:bg-[#004182] transition shadow-md disabled:bg-gray-400 mt-4 text-sm"
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
  );
}
