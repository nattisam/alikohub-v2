import React from "react";
import {
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const AcademyFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Programs",
      links: [
        "All Programs",
        "Software Engineering",
        "Data & Analytics",
        "AI & Machine Learning",
        "UX/UI & Product",
        "Cloud & DevOps",
        "Cybersecurity",
      ],
    },
    {
      title: "Resources",
      links: [
        "Career Services",
        "Projects & Portfolio",
        "Mentors & Instructors",
        "Outcomes & Impact",
        "Learning Paths",
        "Skill Assessment",
      ],
    },
    {
      title: "Company",
      links: [
        "Admissions",
        "Tuition & Payment",
        "Enterprise Training",
        "Partners",
        "Hire Graduates",
        "Contact",
      ],
    },
  ];

  return (
    <footer className="bg-[#0B1221] text-gray-400 py-16 px-6 md:px-12 lg:px-24 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic">
                A
              </div>
              <div className="leading-tight">
                <span className="text-blue-400 font-bold block">
                  AlikoAcademy
                </span>
                <span className="bg-purple-600 text-white text-[10px] px-1 rounded font-bold uppercase">
                  Tech
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-8">
              Build job-ready tech skills with mentor-guided programs and
              real-world projects.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Youtube, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-blue-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Mail size={16} />
                </div>
                <a href="mailto:hello@alikoacademy.tech" className="text-sm">
                  hello@alikoacademy.tech
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <Phone size={16} />
                </div>
                <span className="text-sm">+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <MapPin size={16} />
                </div>
                <span className="text-sm">Remote-first, Global</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px]">
          <p>© {currentYear} Aliko Academy – Tech. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Refund Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Verify Credential
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AcademyFooter;
