import { FaUser, FaStar, FaBook, FaGraduationCap } from "react-icons/fa";

interface UserProfileProps {
  name: string;
  title?: string;
  certifications?: string[];
  experience: number;
  courses: number;
  students: number;
  rating: number;
  className: string;
  avatar?: string;
}

const UserProfileCard: React.FC<UserProfileProps> = ({
  name,
  title,
  className,
  certifications = [],
  experience,
  courses,
  students,
  rating,
  avatar,
}) => (
  <div className={`${className} rounded-2xl shadow-lg border border-gray-100`}>
    <div className="text-center p-6">
      {avatar ? (
        <img
          src={avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
        />
      ) : (
        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center border-4 border-white shadow-lg">
          <FaUser className="w-12 h-12 text-gray-600" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
      {title && <p className="text-gray-600 mt-1">{title}</p>}
      
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {certifications.map((cert, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-medium"
          >
            <FaStar className="mr-1 text-yellow-500" />
            {cert}
          </span>
        ))}
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-medium">
          <FaGraduationCap className="mr-1" />
          {experience}+ Years
        </span>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl p-5">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <FaBook className="text-blue-600" />
          </div>
          <span className="font-extrabold text-xl text-gray-900">{courses}</span>
          <span className="text-sm text-gray-600">Courses</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <FaGraduationCap className="text-green-600" />
          </div>
          <span className="font-extrabold text-xl text-gray-900">{students}</span>
          <span className="text-sm text-gray-600">Students</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
            <FaStar className="text-amber-500" />
          </div>
          <span className="font-extrabold text-xl text-gray-900">{rating}</span>
          <span className="text-sm text-gray-600">Rating</span>
        </div>
      </div>
    </div>
  </div>
);
export default UserProfileCard;