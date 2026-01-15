import React from "react";

type FooterSection = {
  title: string;
  links: string[];
};

type FooterProps = {
  logo: string;
  description: string;
  socialIcons: React.ReactElement[];
  sections: FooterSection[];
  contactIcons?: React.ReactElement[];
  bottomLinks: string[];
};

const Footer: React.FC<FooterProps> = ({
  logo,
  description,
  socialIcons,
  sections,
  contactIcons = [],
  bottomLinks,
}) => {
  const about = sections.find((s) => s.title === "About");
  const community = sections.find((s) => s.title === "Community");
  const contact = sections.find((s) => s.title === "Contact");

  return (
    <footer className="bg-[#F5F8F3] w-full relative z-30" id="contact-us">
      <div className="max-w-screen-xl mx-auto px-6 py-10 md:p-12 flex flex-col gap-10">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between gap-10">
          {/* Left: Logo + Description + Socials */}
          <div className="flex flex-col items-start md:w-1/3">
            <img src={logo} alt="Logo" className="w-40 md:w-56 object-cover" />
            <p className="max-w-xs text-[#1A202C] text-sm mt-2">
              {description}
            </p>
            <div className="flex gap-2 mt-4">
              {socialIcons.map((Icon, i) => (
                <div
                  key={i}
                  className="size-7 rounded-full bg-blue-600 flex items-center justify-center drop-shadow-[-4px_14px_6px_rgba(24,119,242,0.3)]"
                >
                  {Icon}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sections side-by-side */}
          <div className="flex gap-10 md:w-2/3">
            {[about, community, contact].map(
              (section, index) =>
                section && (
                  <div key={index} className="min-w-[150px]">
                    <h3 className="font-extrabold mb-4 text-[#1A202C]">
                      {section.title}
                    </h3>
                    <ul>
                      {section.links.map((link, linkIndex) => (
                        <li
                          key={linkIndex}
                          className="text-[#1A202C] mb-2 text-sm flex items-center gap-2"
                        >
                          {section.title === "Contact"
                            ? contactIcons[linkIndex]
                            : null}
                          <a
                            href={
                              section.title === "Contact"
                                ? link.includes("@")
                                  ? `mailto:${link}`
                                  : link.startsWith("+")
                                  ? `tel:${link}`
                                  : "#"
                                : "#"
                            }
                            className="hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-8 items-center">
          {/* Row 1: About + Community */}
          <div className="flex justify-center gap-10 w-full">
            {[about, community].map(
              (section, index) =>
                section && (
                  <div key={index} className="min-w-[120px] text-center">
                    <h3 className="font-extrabold mb-2 text-[#1A202C]">
                      {section.title}
                    </h3>
                    <ul>
                      {section.links.map((link, linkIndex) => (
                        <li
                          key={linkIndex}
                          className="text-[#1A202C] mb-1 text-sm"
                        >
                          <a href="#" className="hover:underline">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>

          {/* Row 2: Contact Centered */}
          {contact && (
            <div className="text-center">
              <h3 className="font-extrabold mb-2 text-[#1A202C]">
                {contact.title}
              </h3>
              <ul>
                {contact.links.map((link, i) => (
                  <li
                    key={i}
                    className="text-[#1A202C] mb-1 text-sm flex justify-center items-center gap-2"
                  >
                    {contactIcons[i]}
                    <a
                      href={
                        link.includes("@")
                          ? `mailto:${link}`
                          : link.startsWith("+")
                          ? `tel:${link}`
                          : "#"
                      }
                      className="hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Row 3: Logo + Description + Icons */}
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="Logo" className="w-32 object-cover" />
            <p className="max-w-xs text-[#1A202C] text-sm mt-2">
              {description}
            </p>
            <div className="flex gap-2 mt-4">
              {socialIcons.map((Icon, i) => (
                <div
                  key={i}
                  className="size-7 rounded-full bg-blue-600 flex items-center justify-center drop-shadow-[-4px_14px_6px_rgba(24,119,242,0.3)]"
                >
                  {Icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* Bottom Divider */}
        <div className="hidden md:block border border-[#0059FF1a]" />

        {/* Bottom Bar — hidden on mobile */}
        <div className="hidden md:flex pt-4 justify-between items-center text-sm text-[#1A202C]">
          {/* Left: Copyright */}
          <p className="text-left">
            &copy; {new Date().getFullYear()} AlikoHub. All rights reserved
          </p>

          {/* Right: Bottom Links */}
          <div className="flex gap-6 text-right">
            {bottomLinks.map((text, i) => (
              <span key={i} className="hover:underline cursor-pointer">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
