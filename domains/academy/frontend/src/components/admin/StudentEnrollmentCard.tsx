import React from 'react';
import Card from "../../../../../../libraries/ui-libraries/components/Card";
import type { Enrollment } from "../../api/enrollmentApi";
import { Mail, Calendar } from 'lucide-react';

interface StudentEnrollmentCardProps {
  enrollment: Enrollment;
  className?: string;
}

const StudentEnrollmentCard: React.FC<StudentEnrollmentCardProps> = ({ enrollment, className }) => {
  const { user, enrolledAt, progress, status, enrollmentType } = enrollment;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusColor = status === 'ACTIVE' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';

  return (
    <Card
      className={className || "rounded-xl overflow-clip flex flex-col bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"}
      title={`${user?.firstname || 'Unknown'} ${user?.lastname || 'User'}`}
      titleClassName="px-4 pt-4 font-bold text-gray-900"
    >
      <div className="px-4 pb-4 space-y-3 mt-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="truncate">{user?.email || 'No email provided'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Joined: {formatDate(enrolledAt)}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div 
              className="bg-[#0D72BA] h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>
            {status}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            Type: {enrollmentType}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StudentEnrollmentCard;
