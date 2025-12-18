import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import Button from "../../../../../libraries/ui-libraries/components/Button";

type NavLink = {
  label: string;
  href?: string;
  onClick?: () => void;
  isButton?: boolean;
  icon?: React.ReactNode;
};

export type NavbarProps = {
  navLinks: NavLink[];
  logoSrc?: string;
  menuIconClassName?: string;
  closeIconClassName?: string;
  drawerClassName?: string;
};

const Navbar = ({
  navLinks,
  logoSrc = "/AlikoLogo.svg",
  menuIconClassName = "text-3xl text-black",
  closeIconClassName = "text-2xl",
  drawerClassName = "fixed top-0 right-0 h-screen w-full max-w-xs bg-white text-black shadow-lg z-50 transition-opacity duration-300",
}: NavbarProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-inherit"
        aria-label="Open menu"
      >
        <MdMenu className={menuIconClassName} />
      </button>

      {open && (
        <div className={drawerClassName}>
          <div className="flex justify-between items-center p-4 border-b">
            <img src={logoSrc} alt="Logo" className="h-8" />
            <button
              onClick={() => setOpen(false)}
              className="text-white bg-[#000000] rounded-full p-2 hover:bg-[#000000]/90"
              aria-label="Close menu"
            >
              <MdClose className={closeIconClassName} />
            </button>
          </div>

          <ul className="flex flex-col space-y-4 p-6">
            {navLinks.map(({ label, href, onClick, isButton, icon }, i) => (
              <li key={label + i}>
                {isButton ? (
                  <Button
                    label={label}
                    onClick={onClick}
                    icon={icon}
                    iconPosition="right"
                    variant="primary"
                    className="w-full"
                    ariaLabel={label}
                  />
                ) : (
                  <a href={href} className="text-sm font-medium">
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
