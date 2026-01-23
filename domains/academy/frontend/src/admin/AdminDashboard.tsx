import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { authService } from '../services/auth-service';
import { courseApi } from '../api/courseApi';
import { enrollmentApi } from '../api/enrollmentApi';
import type { Enrollment } from '../api/enrollmentApi';
import StudentEnrollmentCard from '../components/admin/StudentEnrollmentCard';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    applications: 0,
    courses: 0,
    students: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [apps, coursesRes, enrollmentsRes] = await Promise.all([
          authService.getTeacherApplications(),
          courseApi.getCourses(),
          enrollmentApi.getAllEnrollments()
        ]);

        // Process Teacher Applications (assumed to be array)
        const appsCount = Array.isArray(apps) ? apps.length : 0;

        // Process Courses (from Postman: { items: [], total: X })
        const coursesCount = coursesRes.data?.total ?? (Array.isArray(coursesRes.data) ? coursesRes.data.length : 0);

        // Process Enrollments
        const enrollmentsData = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : [];
        const enrollmentsCount = enrollmentsData.length;

        setEnrollments(enrollmentsData.slice(0, 5)); // Show latest 5
        setCounts({
          applications: appsCount,
          courses: coursesCount,
          students: enrollmentsCount
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = [
    {
      label: 'Teacher Applications',
      value: counts.applications,
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-[#0D72BA]',
      description: 'Pending review'
    },
    {
      label: 'Total Courses',
      value: counts.courses,
      icon: BookOpen,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      description: 'Across platform'
    },
    {
      label: 'Active Students',
      value: counts.students,
      icon: UserCheck,
      color: 'bg-amber-100',
      iconColor: 'text-amber-600',
      description: 'Total enrollments'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-500">Welcome back, {user?.firstname}. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-[#0D72BA] hover:bg-[#0D72BA]/90 gap-2 text-white"
            onClick={() => navigate('/admin/courses')}
          >
            Manage Courses
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 px-6 pt-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <Icon className={`w-4 h-4 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Enrollments */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Student Enrollments</h2>
          <Button variant="ghost" className="text-[#0D72BA] hover:text-[#0D72BA]/80 text-sm font-medium">
            View All Students
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[200px] bg-gray-100 animate-pulse rounded-xl shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {enrollments.map((enrollment) => (
              <StudentEnrollmentCard 
                key={enrollment.id} 
                enrollment={enrollment} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent enrollments found</p>
          </div>
        )}
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => navigate('/admin/teacher-applications')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D72BA] font-bold text-sm">
                    TA
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New teacher applications pending review
                    </p>
                    <p className="text-xs text-gray-500">Action required</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
              
              <div 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => navigate('/admin/courses')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm">
                    CM
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Course catalog update available
                    </p>
                    <p className="text-xs text-gray-500">Platform update</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm hover:border-[#0D72BA] hover:text-[#0D72BA]"
              onClick={() => navigate('/admin/teacher-applications')}
            >
              Review Teacher Applications
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm hover:border-[#0D72BA] hover:text-[#0D72BA]"
              onClick={() => navigate('/admin/courses')}
            >
              Manage Course Content
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
