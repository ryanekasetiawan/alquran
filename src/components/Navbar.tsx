import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaQuran, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 w-full">
      <div className="max-w-full mx-auto px-5 md:px-12 py-4 flex justify-between items-center">
        <Link to="/" className="flex gap-3 items-center">
          <FaQuran className="text-4xl text-[#3daa25]" />
          <h1 className="text-slate-700 font-bold text-4xl hover:text-[#3daa25] hover:font-bold">
            Qur'anku
          </h1>
        </Link>

        {/* Hamburger Menu for small screens */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className={`transition-transform duration-300 ${isMenuOpen ? "rotate-90" : ""}`}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-4 text-slate-500">
          <li>
            <NavLink
              to="/alquran"
              className={({ isActive }) =>
                isActive
                  ? "text-[#3daa25] font-bold"
                  : "hover:underline hover:text-[#3daa25]"
              }
            >
              Al-Qur'an
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doa"
              className={({ isActive }) =>
                isActive
                  ? "text-[#3daa25] font-bold"
                  : "hover:underline hover:text-[#3daa25]"
              }
            >
              Doa
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/asmaul-husna"
              className={({ isActive }) =>
                isActive
                  ? "text-[#3daa25] font-bold"
                  : "hover:underline hover:text-[#3daa25]"
              }
            >
              Asmaul Husna
            </NavLink>
          </li>
          <li className="relative group">
            <Link
              to="#services"
              className="hover:underline hover:text-[#3daa25]"
            >
              Services
            </Link>
            <ul className="absolute left-0 top-full mt-5 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 transform scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:visible invisible transition-all duration-300 ease-in-out">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="#service1" className="text-slate-600">
                  Service 1
                </Link>
              </li>
              <hr />
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="#service2" className="text-slate-600">
                  Service 2
                </Link>
              </li>
              <hr />
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="#service3" className="text-slate-600">
                  Service 3
                </Link>
              </li>
            </ul>
            <div className="absolute left-0 top-full h-5 w-full"></div>
          </li>
          <li>
            <Link
              to="#contact"
              className="hover:underline hover:text-[#3daa25]"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <button onClick={toggleMenu} className="p-8">
              <FaTimes size={24} />
            </button>
            <Link
              to="/"
              className="flex gap-3 items-center text-center justify-center mb-4"
            >
              <FaQuran className="text-2xl text-[#3daa25]" />
              <h1 className="text-slate-700 font-bold text-2xl hover:text-[#3daa25] hover:font-bold">
                Qur'anku
              </h1>
            </Link>
            <ul className="flex flex-col p-8 space-y-4 text-slate-500">
              <li>
                <NavLink
                  to="/alquran"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#3daa25] font-bold"
                      : "hover:underline hover:text-[#3daa25]"
                  }
                >
                  Al-Qur'an
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/doa"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#3daa25] font-bold"
                      : "hover:underline hover:text-[#3daa25]"
                  }
                >
                  Doa
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/asmaul-husna"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#3daa25] font-bold"
                      : "hover:underline hover:text-[#3daa25]"
                  }
                >
                  Asmaul Husna
                </NavLink>
              </li>
              <li>
                <Link
                  to="#services"
                  className="hover:underline hover:text-[#3daa25]"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="#contact"
                  className="hover:underline hover:text-[#3daa25]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
