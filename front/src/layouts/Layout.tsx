import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="shadow-sm bg-white">
        <Navbar />
      </header>
      <main className="grow container mx-auto px-6 py-10">
        <Outlet />
      </main>
      <footer className="bg-green-900 text-gray-200 py-8">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
