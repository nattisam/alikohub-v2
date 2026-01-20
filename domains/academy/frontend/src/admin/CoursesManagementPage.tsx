import { useState, useEffect } from 'react';
import { courseApi } from '../api/courseApi';

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  instructorId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_APPROVAL' | 'REJECTED';
  skills: string[];
  conceptsLearned: string[];
  outcomes: string[];
  rejectionReason: string | null;
  estimatedTime: number | null;
  targetLevel: string | null;
  enrolledNum: number;
  rating: number | null;
  price: number | null;
  prerequisites: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: number;
    firebaseId: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    globalRole: string;
    profilePicture: string | null;
    bio: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    academyUser: {
      id: string;
      userId: string;
      role: string;
      activeRole: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    consultancyUser: unknown;
    contechUser: {
      id: string;
      userId: string;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    eventsUser: {
      id: string;
      userId: string;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    careersUser: unknown;
  };
}

const CoursesManagementPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    pending: 0,
  });
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        
        // Handle the expected response structure
        let coursesData: Course[] = [];
        if (response.data && typeof response.data === 'object' && Array.isArray(response.data.items)) {
          coursesData = response.data.items;
        } else if (Array.isArray(response.data)) {
          coursesData = response.data;
        } else {
          console.error('Unexpected response structure:', response);
          coursesData = [];
        }
        
        setCourses(coursesData);
        
        // Calculate statistics
        const total = coursesData.length;
        const published = coursesData.filter((course: Course) => course.status === 'PUBLISHED').length;
        const draft = coursesData.filter((course: Course) => course.status === 'DRAFT').length;
        const pending = coursesData.filter((course: Course) => course.status === 'PENDING_APPROVAL').length;
        
        setStats({
          total,
          published,
          draft,
          pending,
        });
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleApprove = async (id: number) => {
    try {
      await courseApi.approveCourse(id);
      // Refresh the courses list
      const response = await courseApi.getCourses();
      
      // Handle the expected response structure
      let coursesData: Course[] = [];
      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.items)) {
        coursesData = response.data.items;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else {
        console.error('Unexpected response structure:', response);
        coursesData = [];
      }
      
      setCourses(coursesData);
      alert('Course approved successfully!');
    } catch (error) {
      console.error('Error approving course:', error);
      alert('Failed to approve course');
    }
  };
  
  const handleReject = async (id: number) => {
    try {
      const reason = prompt('Enter rejection reason:');
      if (reason !== null) {
        await courseApi.rejectCourse(id, reason);
        // Refresh the courses list
        const response = await courseApi.getCourses();
        
        // Handle the expected response structure
        let coursesData: Course[] = [];
        if (response.data && typeof response.data === 'object' && Array.isArray(response.data.items)) {
          coursesData = response.data.items;
        } else if (Array.isArray(response.data)) {
          coursesData = response.data;
        } else {
          console.error('Unexpected response structure:', response);
          coursesData = [];
        }
        
        setCourses(coursesData);
        alert('Course rejected successfully!');
      }
    } catch (error) {
      console.error('Error rejecting course:', error);
      alert('Failed to reject course');
    }
  };
  
  const handlePublish = async (id: number) => {
    try {
      await courseApi.updateCourseStatus(id, 'PUBLISHED');
      // Refresh the courses list
      const response = await courseApi.getCourses();
      
      // Handle the expected response structure
      let coursesData: Course[] = [];
      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.items)) {
        coursesData = response.data.items;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else {
        console.error('Unexpected response structure:', response);
        coursesData = [];
      }
      
      setCourses(coursesData);
      alert('Course published successfully!');
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Failed to publish course');
    }
  };
  
  const handleArchive = async (id: number) => {
    try {
      await courseApi.updateCourseStatus(id, 'ARCHIVED');
      // Refresh the courses list
      const response = await courseApi.getCourses();
      
      // Handle the expected response structure
      let coursesData: Course[] = [];
      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.items)) {
        coursesData = response.data.items;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else {
        console.error('Unexpected response structure:', response);
        coursesData = [];
      }
      
      setCourses(coursesData);
      alert('Course archived successfully!');
    } catch (error) {
      console.error('Error archiving course:', error);
      alert('Failed to archive course');
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Course List</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add New Course
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md" src={course.thumbnail} alt="Thumbnail" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{course.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.instructor ? `${course.instructor.firstname} ${course.instructor.lastname}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrolledNum}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(course.status)}`}>
                      {course.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {course.status === 'PENDING_APPROVAL' && (
                        <>
                          <button 
                            onClick={() => handleApprove(course.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(course.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {course.status === 'DRAFT' && (
                        <button 
                          onClick={() => handlePublish(course.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Publish"
                        >
                          Publish
                        </button>
                      )}
                      {(course.status === 'PUBLISHED') && (
                        <button 
                          onClick={() => handleArchive(course.id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Archive"
                        >
                          Archive
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Course Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Courses:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Published:</span>
              <span className="font-medium">{stats.published}</span>
            </div>
            <div className="flex justify-between">
              <span>Draft:</span>
              <span className="font-medium">{stats.draft}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Approval:</span>
              <span className="font-medium">{stats.pending}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Top Categories</h3>
          <div className="space-y-2">
            {Array.from(new Set(courses.map(course => course.category)))
              .slice(0, 3)
              .map(category => {
                const count = courses.filter(course => course.category === category).length;
                return (
                  <div key={category} className="flex justify-between">
                    <span>{category}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesManagementPage;