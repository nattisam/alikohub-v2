import { Link, NavLink } from 'react-router-dom';
import { LogIn, Menu, UserPlus, X } from 'lucide-react';
import { useState } from 'react';


export default function Navbar() {
const [open, setOpen] = useState(false);


const linkClass = ({ isActive }: { isActive: boolean }) =>
`px-3 py-2 rounded-md text-sm transition ${
isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'
}`;


return (
<nav className="bg-[#0b1620] text-white px-6 py-4">
<div className="flex items-center justify-between max-w-7xl mx-auto">
<Link to="/" className="font-semibold text-lg">AlikoHub</Link>
{/* Desktop Nav */}
<div className="hidden md:flex items-center gap-6">
<NavLink to="/" className={linkClass}>Home</NavLink>
<NavLink to="/events" className={linkClass}>Events</NavLink>
<NavLink to="/news" className={linkClass}>News & Announcements</NavLink>
<NavLink to="/promotion-request" className={linkClass}>Promotion Request</NavLink>
</div>


{/* Desktop Actions */}
<div className="hidden md:flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-gray-600 hover:border-white transition">
<LogIn size={16} /> Sign In
</button>
<button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-blue-600 hover:bg-blue-700 transition">
<UserPlus size={16} /> Register
</button>
</div>
{/* Mobile Menu Button */}
<button
onClick={() => setOpen(!open)}
className="md:hidden"
>
{open ? <X /> : <Menu />}
</button>
</div>


{/* Mobile Menu */}
{open && (
<div className="md:hidden mt-4 space-y-2 bg-[#02080f] rounded-xl p-4">
<NavLink onClick={() => setOpen(false)} to="/" className={linkClass}>Home</NavLink>
<NavLink onClick={() => setOpen(false)} to="/events" className={linkClass}>Events</NavLink>
<NavLink onClick={() => setOpen(false)} to="/news" className={linkClass}>News & Announcements</NavLink>
<NavLink onClick={() => setOpen(false)} to="/promotion-request" className={linkClass}>Promotion Request</NavLink>
</div>
)}
</nav>
);
}