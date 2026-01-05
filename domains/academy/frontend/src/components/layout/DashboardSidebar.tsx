import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaCog, FaBook, FaCertificate, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine dashboard path based on role
  const userRole = user?.currentRole || user?.academyRole;
  const dashboardPath = userRole === 'INSTRUCTOR' ? '/instructor' : 
                        userRole === 'ADMIN' ? '/admin' : '/student-dashboard';
  
  const menuItems = [
    { path: "", label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/student-dashboard/courses', label: 'My Courses', icon: FaBook },
    { path: '/student-dashboard/courses/progress', label: 'Progress', icon: FaChartLine },
    { path: '/student-dashboard/courses/certificates', label: 'Certificates', icon: FaCertificate },
    { path: '/student-dashboard/profile', label: 'Profile', icon: FaUser },
    { path: '/student-dashboard/settings', label: 'Settings', icon: FaCog },
  ];

  const isActive = (path: string) => {
    if (path === dashboardPath) {
      return location.pathname === dashboardPath;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
