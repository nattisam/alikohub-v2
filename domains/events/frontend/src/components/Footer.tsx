import logo from "../assets/AlikoLogo.svg";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { FiMail, FiPhone } from "react-icons/fi";

const FooterLinks = [
   {
      title: "About",
      links: ["How it works", "Features", "Partnership", "Business Relation"],
   },
   {
      title: "Community",
      links: ["Events", "Blog", "Podcast", "Invite a friend"],
   },
   {
      title: "Contact",
      links: ["alikohub@gmail.com", "Bole Dembel, Tigis building 12th floor,", "+2519845976"],
   },
];
const Icons=[
   <FiMail  className="text-blue-600 drop-shadow-[0px_8px_6px_blue-600]"/>,
   <FaLocationDot className="text-blue-600 drop-shadow-[0px_8px_6px_rgba(24,119,242,0.4)]"/>,
   <FiPhone className="text-blue-600 drop-shadow-[0px_8px_6px_rgba(24,119,242,0.4)]"/>
]
 const Footer = () => {
   return (
      <footer className="w-full relative bg-black text-white" id="contact-us">
         <div className="px-6 py-10 md:p-12 flex flex-col md:flex-row md:justify-between md:items-start gap-10">
            <div className="flex flex-col items-start">
               <img src={logo} alt="Aliko's-Logo" className="w-40 md:w-56 object-cover" />
               <p className="max-w-2xs text-sm mt-1">
                  Our vision is to provide convenience and help increase your sales business.
               </p>
               
               <div className="flex gap-2 mt-4">
                  {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                     <div key={i}
                        className="size-7 rounded-full bg-blue-600 flex items-center justify-center drop-shadow-[-4px_14px_6px_rgba(24,119,242,0.3)]"
                     >
                        <Icon className="w-4 h-4 text-white" />
                     </div>
                  ))}
               </div>
            </div>
            <div className="flex flex-row flex-wrap justify-around items-center sm:gap-10 md:gap-[120px]">
               {FooterLinks.map((footerLink, index) => (
                  <div key={index} className="flex flex-col not-md:items-center mt-6 sm:mt-0">
                     <h3 className="font-extrabold mb-6">{footerLink.title}</h3>
                     <ul className="flex flex-col not-md:items-center">
                        {footerLink.links.map((link, linkIndex) => (
                           <li
                              key={linkIndex}
                              className="mb-2 text-gray-300 text-sm flex items-center gap-2"
                           >
                              {footerLink.title === "Contact" ? Icons[linkIndex] : null}
                              <a href="/contact">{link}</a>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
         <div className="p-6 md:p-12">
            <div className="bg-[#E1F1FF] h-[1px]" />
            <div className="pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-white gap-4 sm:gap-0">
               <p>&copy;{`${new Date().getFullYear()} AlikoHub. All rights reserved`}</p>
               <div className="flex gap-16">
                  <span>Privacy & Policy</span>
                  <span>Terms & Condition</span>
               </div>
            </div>
         </div>
      </footer>
   );
};
 export default Footer;