import React from 'react';

const CoursesManagementPage = () => {
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Introduction to React</div>
                  <div className="text-sm text-gray-500">Learn the basics of React development</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Web Development</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,245</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Advanced JavaScript Concepts</div>
                  <div className="text-sm text-gray-500">Deep dive into advanced JS patterns</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Programming</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">876</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">UI/UX Design Principles</div>
                  <div className="text-sm text-gray-500">Master design fundamentals</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bob Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Design</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">542</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
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
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between">
              <span>Published:</span>
              <span className="font-medium">118</span>
            </div>
            <div className="flex justify-between">
              <span>Draft:</span>
              <span className="font-medium">24</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Top Categories</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Web Development</span>
              <span className="font-medium">32</span>
            </div>
            <div className="flex justify-between">
              <span>Programming</span>
              <span className="font-medium">28</span>
            </div>
            <div className="flex justify-between">
              <span>Design</span>
              <span className="font-medium">22</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesManagementPage;