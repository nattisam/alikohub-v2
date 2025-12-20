import logo from "../assets/logo.svg";

type NavLink = {
  label: string;
  href?: string;
};
type NavbarProps = {
  navLinks: NavLink[];
};

const Navbar = ({ navLinks = [] }: NavbarProps) => {
  return (
    // Main container for the fixed desktop navigation bar
    <nav className="fixed items-center top-0 left-0 w-full z-50 bg-gradient-to-r from-[rgba(153,153,153,0.7)] to-[rgba(177, 196, 213, 0.5)] text-white justify-between shadow-md">
      <div className="container p-6 h-16 flex items-center  text-black justify-between ">
        {/* Logo Section */}
        <a href="/" className="text-2xl font-bold">
          <img src={logo} alt="Logo" className="h-16" />
        </a>

        <ul className="flex items-center space-x-2 gap-6 ">
          {navLinks.map(({ label, href }, i) => (
            <li key={label + i}>
              <a
                href={href || "#"}
                onClick={(e) => !href && e.preventDefault()}
                className="text-black text-2xl font-medium hover:text-gray-200 no-underline"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex space-x-4">
          <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors">
            Sign Up
          </button>
          <button className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors">
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
