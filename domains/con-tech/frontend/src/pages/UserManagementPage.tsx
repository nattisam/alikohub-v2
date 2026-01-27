import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks';
import { Search, Users, Briefcase, CheckCircle, ChevronRight, UserPlus, Loader2 } from 'lucide-react';

const UserManagementPage = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setUsers([
            { id: 1, firstName: 'Abebe', lastName: 'Kebede', email: 'abebe@aliko.com', role: 'CONTRACTOR', status: 'ACTIVE', projects: 3 },
            { id: 2, firstName: 'Zewidu', lastName: 'Alemu', email: 'zewidu@client.com', role: 'CLIENT', status: 'ACTIVE', projects: 1 },
            { id: 3, firstName: 'Martha', lastName: 'Tessema', email: 'martha@aliko.com', role: 'CONTRACTOR', status: 'ACTIVE', projects: 2 },
            { id: 4, firstName: 'Samuel', lastName: 'Bekele', email: 'samuel@partner.com', role: 'CLIENT', status: 'ACTIVE', projects: 1 },
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, navigate]);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-medium text-gray-600">Loading Directory...</p>
        </div>
      </div>
    );
  }

  return (
<div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">

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
            onClick={() => {}}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Create New Account
          </button>
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
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                {/* Role Badge */}
                <div className="absolute right-4 top-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === 'CONTRACTOR'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      user.role === 'CONTRACTOR'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                    }`}
                  >
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="truncate text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{user.projects}</span>
                    <span className="text-gray-400">Projects</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-emerald-600">{user.status}</span>
                  </div>
                </div>

                {/* Action */}
                <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-gray-50 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                  User Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16">
            <Users className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Empty Directory</h3>
            <p className="mt-1 text-sm text-gray-500">
              No users matching your search were found.
            </p>
          </div>
        )}
      </div>
  );
};

export default UserManagementPage;
