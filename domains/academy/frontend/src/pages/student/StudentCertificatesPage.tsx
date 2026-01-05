import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EmptyState from '../../components/states/EmptyState';
import { FaCertificate } from 'react-icons/fa';

const StudentCertificatesPage: React.FC = () => {
  const { user: currentUser } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Certificates</h1>
        <p className="text-gray-600">View and manage your earned certificates</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EmptyState
          title="No Certificates Yet"
          message="You haven't earned any certificates yet. Complete courses to earn certificates."
          icon={<FaCertificate className="text-blue-500 text-3xl" />}
          actionText="Browse Courses"
          showAction={true}
          onAction={() => window.location.href = '/courses'}
        />
      </div>
    </div>
  );
};

export default StudentCertificatesPage;