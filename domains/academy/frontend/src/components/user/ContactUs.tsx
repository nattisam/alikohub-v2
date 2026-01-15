import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FaLinkedin, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function ContactUs() {
  return (
    <div className="flex flex-col items-center justify-center h-170 bg-white p-8 font-sans mb-40">
      {/* Main header section */}
      <div className="text-center mb-20 max-w-2xl">
        <h1 className="text-5xl md:text-5.5xl font-bold text-gray-900 mb-4">Don't hesitate to contact us</h1>
        <p className="text-lg text-gray-600 mt-5">
          lorem ipsum dolor sit amet consectetuer adipiscing elit sed diam nonummy nibh.
        </p>
      </div>

      {/* Information Cards Section - Uses a responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 w-full max-w-4xl my-5">
        {/* Office Card */}
        <div className="bg-white rounded-2xl p-6 flex items-center space-x-4 "
         style={{ boxShadow: '0 3px 15px rgba(0, 0, 3, 0.1)' }}
>
          <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Office</h3>
            <p className="text-sm text-gray-500">Bole Dembel, Tigist building 12th floor,</p>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4"
        style={{ boxShadow: '0 3px 15px rgba(0, 0, 3, 0.1)' }}
        >
          <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
            <Phone className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Phone</h3>
            <p className="text-sm text-gray-500">+2519845976</p>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4"
        style={{ boxShadow: '0 3px 15px rgba(0, 0, 3, 0.1)' }}>
          <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Email</h3>
            <p className="text-sm text-gray-500">alikohub@gmail.com</p>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4"
        style={{ boxShadow: '0 3px 15px rgba(0, 0, 3, 0.1)' }}>
          <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Working hours</h3>
            <p className="text-sm text-gray-500">Monday-Friday 8:00 - 5:00</p>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="flex flex-col items-center mt-30">
        <h3 className="text-lg font-semibold text-gray-800 m-4">Social media:</h3>
        <div className="flex space-x-4">
          {/* Social media icons - you would replace these with Lucide icons too */}
          <a href="#" className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
            <FaFacebook className="h-6 w-6" />
          </a>
          <a href="#" className="p-3 bg-pink-500 rounded-full text-white hover:bg-pink-600 transition-colors">
              <FaInstagram className='h-6 w-6'/>          
                </a>
          <a href="#" className="p-3 bg-gray-900 rounded-full text-white hover:bg-gray-700 transition-colors">
             <FaTwitter className="h-6 w-6" /> 
          </a>
          <a href="#" className="p-3 bg-blue-800 rounded-full text-white hover:bg-blue-900 transition-colors">
             <FaLinkedin className="h-6 w-6" />
          </a>
        </div>
      </div>

      <div className="bg-blue-50 w-screen h-50" >

      </div>
    </div>
  );
}