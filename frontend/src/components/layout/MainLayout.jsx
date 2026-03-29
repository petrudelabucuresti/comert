import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2B2B2B]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}