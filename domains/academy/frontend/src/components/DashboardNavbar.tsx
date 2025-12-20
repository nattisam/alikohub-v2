import { FaBell } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import type React from "react";
import { useUser } from "../hooks/useUser";
import type { Language } from "./types.d";

interface DashboardNavbarProps {
  onNotifications: ()=>void;
   onAvatarCLick:()=>void;
}
const DashboardNavbar:React.FC<DashboardNavbarProps> = ({onNotifications, onAvatarCLick}) => {
  const {language, setLanguage } = useUser()
  return (
    <header className="bg-white shadow">
      <button>
        <FiMenu size={25} color="black" />
      </button>
      <Link to="/" className="h-full  w-12 flex items-center">
        <img
          src="/AlikoLogo.svg"
          alt="logo of Alikohub"
          className="w-full cursor-pointer h-auto"
        />
      </Link>
      <nav>Dashboard</nav>
      <div>
        <button onClick={onNotifications}>
          <FaBell size={20} />
        </button>
        <select  value={language} onChange={(e)=>setLanguage(e.target.value as Language)} >
          <option value={"En"}>English</option>
          <option value={"Amh"}>Amharic</option>
          <option value={"Swahili"}>Swahili</option>
        </select>
        <button onClick={onAvatarCLick}>
          <FaCircleUser size={30} />
        </button>
      </div>
    </header>
  );
};
export default DashboardNavbar;
