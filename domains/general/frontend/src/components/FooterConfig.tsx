import logo from "../assets/icon";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

export const footerConfig = {
  logo,
  description:
    "Our vision is to provide convenience and help increase your sales business.",
  socialIcons: [
    <FaFacebookF className="w-4 h-4 text-white" />,
    <FaInstagram className="w-4 h-4 text-white" />,
    <FaTwitter className="w-4 h-4 text-white" />,
    <FaLinkedinIn className="w-4 h-4 text-white" />,
  ],
  sections: [
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
      links: [
        "alikohub@gmail.com",
        "Bole Dembel, Tigis building 12th floor,",
        "+2519845976",
      ],
    },
  ],
  contactIcons: [
    <MdEmail className="text-blue-600 drop-shadow-[0px_8px_6px_rgba(24,119,242,0.4)]" />,
    <MdLocationOn className="text-blue-600 drop-shadow-[0px_8px_6px_rgba(24,119,242,0.4)]" />,
    <MdPhone className="text-blue-600 drop-shadow-[0px_8px_6px_rgba(24,119,242,0.4)]" />,
  ],
  bottomLinks: ["Privacy & Policy", "Terms & Condition"],
};
