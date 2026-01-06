import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { academyAPI } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define TypeScript interfaces
interface TeacherApplication {
  id: string;
  userId: string;
  personalDetails: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
  };
  teachingCategories: string[];
  resumeUrl?: string;
  interviewResponses: {
    question: string;
    answer: string;
  }[];
  documents?: {
    name: string;
    url: string;
  }[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

const TeacherApplicationsDashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // State for applications and UI
  const { data: applications = [], isLoading, isError, refetch, error } = useQuery<TeacherApplication[]>({
    queryKey: ['teacherApplications'],
    queryFn: academyAPI.getTeacherApplications,
  });
  
  const approveMutation = useMutation({
    mutationFn: academyAPI.approveTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherApplications'] });
    },
  });
  
  const rejectMutation = useMutation({
    mutationFn: academyAPI.rejectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherApplications'] });
    },
  });

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL'); // ALL, PENDING, APPROVED, REJECTED

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Function to handle approve action
  const handleApprove = (applicationId: string) => {
    approveMutation.mutate(applicationId);
  };

  // Function to handle reject action
  const handleReject = (applicationId: string) => {
    rejectMutation.mutate(applicationId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teacher applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    // Check if the error is a permissions error (401 or 403)
    const isPermissionError = error?.response?.status === 401 || error?.response?.status === 403;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{isPermissionError ? 'Access Denied' : 'Error'}</h2>
          <p className="text-gray-600">
            {isPermissionError 
              ? 'You do not have permission to access teacher applications.'
              : 'Failed to load teacher applications. Please try again later.'}
          </p>
          {!isPermissionError && (
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Applications</h1>
          <p className="mt-2 text-gray-600">Manage teacher applications and approve/reject requests</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Applications
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="status-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Applications List</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {filteredApplications.length} of {applications.length} application{applications.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied For
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No teacher applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.user.firstname} {application.user.lastname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Teacher
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800' 
                            : application.status === 'REJECTED' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {application.status === 'PENDING' ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleApprove(application.id)}
                              disabled={approveMutation.isPending}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              {approveMutation.isPending && approveMutation.variables === application.id ? (
                                <span className="flex items-center">
                                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></span>
                                  Approving...
                                </span>
                              ) : (
                                'Approve'
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(application.id)}
                              disabled={rejectMutation.isPending}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              {rejectMutation.isPending && rejectMutation.variables === application.id ? (
                                <span className="flex items-center">
                                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></span>
                                  Rejecting...
                                </span>
                              ) : (
                                'Reject'
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Action completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherApplicationsDashboard;