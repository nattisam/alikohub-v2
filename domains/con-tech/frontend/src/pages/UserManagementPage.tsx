import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks";
import {
  Search,
  Users,
  Briefcase,
  CheckCircle,
  UserPlus,
  Loader2,
  X,
  HardHat,
  Building2,
} from "lucide-react";
import { useUsersByRole, useCreateUser } from "../queries/users";
import ServerError from "../components/common/ServerError";

const UserManagementPage = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "contractors" | "clients" | "content_managers"
  >("contractors");

  // Queries using TanStack Query
  const {
    data: contractors = [],
    isLoading: loadingContractors,
    isError: errorContractors,
    refetch: refetchContractors,
  } = useUsersByRole("CONTRACTOR");

  const {
    data: clients = [],
    isLoading: loadingClients,
    isError: errorClients,
    refetch: refetchClients,
  } = useUsersByRole("CLIENT");

  const {
    data: contentManagers = [],
    isLoading: loadingContentManagers,
    isError: errorContentManagers,
    refetch: refetchContentManagers,
  } = useUsersByRole("CONTENT_MANAGER");

  // Create User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CONTRACTOR",
  });
  const createUserMutation = useCreateUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    createUserMutation.mutate(
      {
        email: formData.email,
        firstname: formData.firstName,
        lastname: formData.lastName,
        password: formData.password,
        role: formData.role,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "CONTRACTOR",
          });
          alert(`User ${formData.firstName} created successfully!`);
        },
        onError: (err: any) => {
          console.error("Failed to create user:", err);
          setError(
            err.response?.data?.message ||
              "Failed to create user. Please try again.",
          );
        },
      },
    );
  };

  const loading =
    loadingContractors || loadingClients || loadingContentManagers;
  const isError = errorContractors || errorClients || errorContentManagers;
  const currentUsers =
    activeTab === "contractors"
      ? contractors
      : activeTab === "clients"
        ? clients
        : contentManagers;

  const filteredUsers = currentUsers.filter(
    (user: any) =>
      user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#3E92D1]" />
          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading Directory...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ServerError
        onRetry={() => {
          refetchContractors();
          refetchClients();
          refetchContentManagers();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative">
      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Account
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex gap-3 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#3E92D1] focus:ring-4 focus:ring-[#3E92D1]/10 transition-all font-medium"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "CONTRACTOR" })
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden ${
                      formData.role === "CONTRACTOR"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                      <div
                        className={`p-2 rounded-lg ${formData.role === "CONTRACTOR" ? "bg-[#3E92D1] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <HardHat className="w-4 h-4" />
                      </div>
                      <span
                        className={`font-bold ${formData.role === "CONTRACTOR" ? "text-[#3E92D1]" : "text-gray-700"}`}
                      >
                        Contractor
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "CLIENT" })}
                    className={`p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden ${
                      formData.role === "CLIENT"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                      <div
                        className={`p-2 rounded-lg ${formData.role === "CLIENT" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span
                        className={`font-bold ${formData.role === "CLIENT" ? "text-emerald-900" : "text-gray-700"}`}
                      >
                        Client
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "CONTENT_MANAGER" })
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden ${
                      formData.role === "CONTENT_MANAGER"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                      <div
                        className={`p-2 rounded-lg ${formData.role === "CONTENT_MANAGER" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                      <span
                        className={`font-bold ${formData.role === "CONTENT_MANAGER" ? "text-purple-900" : "text-gray-700"}`}
                      >
                        Manager
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex-[2] bg-gray-900 text-white font-bold rounded-xl py-3.5 shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createUserMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            User Directory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage internal staff and external partner access
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          Create New Account
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("contractors")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "contractors"
                ? "border-[#3E92D1] text-[#3E92D1]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <HardHat className="h-4 w-4" />
              Contractors ({contractors.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "clients"
                ? "border-[#3E92D1] text-[#3E92D1]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Clients ({clients.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("content_managers")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "content_managers"
                ? "border-[#3E92D1] text-[#3E92D1]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Managers ({contentManagers.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#3E92D1] focus:ring-2 focus:ring-[#3E92D1]/20"
          />
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Projects</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {filteredUsers.map((user: any) => (
                <tr
                  key={user.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                          user.role === "CONTRACTOR"
                            ? "bg-gradient-to-br from-[#3E92D1] to-[#2E82C1]"
                            : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        }`}
                      >
                        {user.firstname?.[0]}
                        {user.lastname?.[0]}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.firstname} {user.lastname}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 max-w-[200px] truncate"
                    title={user.email}
                  >
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "CONTRACTOR"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {user.projects?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium text-emerald-700">
                        Active
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
          <Users className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Empty Directory
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No users matching your search were found.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
