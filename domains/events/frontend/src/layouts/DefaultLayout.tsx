import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
const DefaultLayout = () => {
    return(
        <div className="bg-black text-white min-h-screen">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    )
};

export default DefaultLayout;