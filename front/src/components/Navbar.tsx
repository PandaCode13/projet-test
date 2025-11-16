import { useAuth } from "@/lib/hooks";
import {
  ChartLine,
  ChartNoAxesColumn,
  CirclePlus,
  List,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  console.log("Navbar user:", user);
  return (
    <nav className="bg-white w-full">
      <div className="px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Link className="text-2xl font-bold text-green-800" to="/">
            GlycAmed
          </Link>
          <ul className="hidden md:flex space-x-4 text-gray-700 font-medium">
            <li>
              <Link className="flex gap-2 hover:text-slate-900" to="/search">
                <List />
                Products
              </Link>
            </li>
            <li>
              <Link className="flex gap-2 hover:text-slate-900" to="/dashboard">
                <ChartNoAxesColumn />
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="flex gap-2 hover:text-slate-900" to="/analytics">
                <ChartLine />
                Analytics
              </Link>
            </li>
          </ul>
        </div>
        <ul className="hidden md:flex space-x-4 text-gray-700 font-medium">
          {/* Button to add consumption */}

          {user ? (
            <>
              <li>
                <Link
                  className="flex gap-2 text-white hover:text-gray-200 bg-green-800 hover:bg-green-900 p-3 rounded-md"
                  to="/add-consumption"
                >
                  <CirclePlus />
                  Add Consumption
                </Link>
              </li>
              <li>
                <Link
                  className="flex gap-2 text-white hover:text-gray-200 bg-green-800 hover:bg-green-900 p-3 rounded-md"
                  to="/"
                  onClick={() => logout()}
                >
                  <User />
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                className="flex gap-2 text-white hover:text-gray-200 bg-green-800 hover:bg-green-900 p-3 rounded-md"
                to="/login"
              >
                <User />
                Login
              </Link>
            </li>
          )}
        </ul>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg md:hidden transition-transform duration-300">
          <ul className="flex flex-col space-y-6 px-6 py-8 text-gray-700 font-medium text-sm items-end">
            <li
              className="block hover:text-slate-900 cursor-pointer w-fit self-start"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </li>
            {user && <li>Add Consumption</li>}
            <li>
              <Link className="block hover:text-slate-900" to="/search-product">
                Products
              </Link>
            </li>
            <li>
              <Link className="block hover:text-slate-900" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="block hover:text-slate-900" to="/analytics">
                Analytics
              </Link>
            </li>
            {user ? (
              <li className="text-white bg-green-800 p-2 rounded w-full text-center">
                <Link to="/" onClick={() => logout()}>
                  Logout
                </Link>
              </li>
            ) : (
              <li className="text-white bg-green-800 p-2 rounded w-full text-center">
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
