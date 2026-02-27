import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full pt-32 overflow-hidden">
      {/* Full-width background image */}
      <img
        src="/src/assets/FooterBackground.png"
        alt="Footer Background"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      {/* Frosted Glass Container */}
      <div className="bg-white/0 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-screen-full mx-auto">
        <div className="hidden text-white md:flex flex-row justify-between items-start gap-10 md:text-gray-800">
          <div className="max-w-sm">
            <img
              src="./assets/AlikoLogo.svg"
              alt="AlikoHub Logo"
              className=" mb-4"
            />
            <p className="text-sm text-white leading-relaxed">
              Our vision is to provide convenience and help increase your sales business.
            </p>
            <div className="flex gap-3 mt-4">
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-lg shadow-[#0E76BE] text-white">
                <FaFacebookF />
              </div>
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-lg shadow-[#0E76BE] text-white">
                <FaInstagram />
              </div>
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-lg shadow-[#0E76BE] text-white">
                <FaTwitter />
              </div>
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-md shadow-[#0E76BE] text-white">
                <FaLinkedinIn />
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-3 gap-8 w-full md:w-2/3">
            {/* About */}
            <div>
              <h3 className="font-semibold mb-3  text-white">About</h3>
              <ul className="space-y-2 text-white text-sm">
                <li className="text-white">How it works</li>
                <li className="text-white">Featured</li>
                <li className="text-white">Partnership</li>
                <li className="text-white">Business Relation</li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-semibold text-white mb-3">Community</h3>
              <ul className="space-y-2 text-white text-sm">
                <li>Events</li>
                <li>Blog</li>
                <li>Podcast</li>
                <li>Invite a friend</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex text-white items-center gap-2">
                  <MdEmail className="text-blue-600" />
                  alikohub@gmail.com
                </li>
                <li className="flex text-white not-first:items-center gap-2">
                  <MdLocationOn className="text-blue-600" />
                  Bole Dembel, Tigis building 12th floor
                </li>
                <li className="flex text-white items-center gap-2">
                  <MdPhone className="text-blue-600" />
                  +2519845976
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-10 text-white">
          {/* Row 1: About + Community */}
          <div className="flex justify-between gap-10">
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <ul className="space-y-2 text-sm">
                <li>How it works</li>
                <li>Featured</li>
                <li>Partnership</li>
                <li>Business Relation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>Events</li>
                <li>Blog</li>
                <li>Podcast</li>
                <li>Invite a friend</li>
              </ul>
            </div>
          </div>

          {/* Row 2: Contact Centered */}
          <div className="text-center">
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-center items-center gap-2">
                <MdEmail className="text-blue-600" />
                alikohub@gmail.com
              </li>
              <li className="flex justify-center items-center gap-2">
                <MdLocationOn className="text-blue-600" />
                Bole Dembel, Tigis building 12th floor
              </li>
              <li className="flex justify-center items-center gap-2">
                <MdPhone className="text-blue-600" />
                +2519845976
              </li>
            </ul>
          </div>

          {/* Row 3: Logo + Description + Icons */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/AlikoLogo.svg"
              alt="AlikoHub Logo"
              className="w- mb-4"
            />
            <p className="text-sm leading-relaxed max-w-xs">
              Our vision is to provide convenience and help increase your sales business.
            </p>
            <div className="flex gap-3 mt-4">
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-md text-white">
                <FaFacebookF />
              </div>
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-md text-white">
                <FaInstagram />
              </div>
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-md text-white">
                <FaTwitter />
              </div>
              <div className="bg-[#0E76BE] p-2 rounded-full shadow-md text-white">
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Desktop Only */}
        <div className="hidden md:flex border-t border-gray-300 mt-10 pt-4 justify-between items-center text-xs text-white">
          <p>©2025 AlikoHub. All rights reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy & Policy</a>
            <a href="#" className="hover:underline">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;