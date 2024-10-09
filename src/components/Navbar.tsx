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
    <header className="bg-white sticky top-0 z-[100] w-full">
      <nav className="max-w-full mx-auto px-5 md:px-12 py-4 flex justify-between items-center">
        {/*<div>*/}
        <Link
          to="/"
          className="flex text-2xl md:text-4xl gap-3 items-center text-slate-800 font-bold hover:text-[#3daa25]"
        >
          <FaQuran className="text-[#3daa25]" />
          <h1 className="hover:text-[#3daa25]">Qur'anku</h1>
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
        <ul className="hidden lg:flex space-x-4 text-slate-500 text-lg">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-[#3daa25] font-bold"
                  : "hover:underline hover:text-[#3daa25]"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/quran"
              className={({ isActive }) =>
                isActive
                  ? "text-[#3daa25] font-bold"
                  : "hover:underline hover:text-[#3daa25]"
              }
            >
              Al-Qur'an & Tafsir
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
          {/*<li className="relative group">
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
          </li>*/}
          {/*<li>
            <Link
              to="#contact"
              className="hover:underline hover:text-[#3daa25]"
            >
              Contact
            </Link>
          </li>*/}
        </ul>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-[100] overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between text-center py-6 pl-8 pr-4">
              <Link
                to="/"
                className="flex gap-2 items-center text-center justify-center text-2xl text-slate-800 font-bold hover:text-[#3daa25]"
                onClick={handleLinkClick}
              >
                <FaQuran className="text-[#3daa25]" />
                <h1 className="hover:text-[#3daa25]">Qur'anku</h1>
              </Link>
              <button onClick={toggleMenu} className="p-0.5">
                <FaTimes size={20} />
              </button>
            </div>
            <ul className="flex flex-col p-8 space-y-4 text-slate-500">
              <li>
                <NavLink
                  to="/"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#3daa25] font-bold"
                      : "hover:underline hover:text-[#3daa25]"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quran"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#3daa25] font-bold"
                      : "hover:underline hover:text-[#3daa25]"
                  }
                >
                  Al-Qur'an & Tafsir
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
            </ul>
          </div>
        )}
        {/*</div>*/}
      </nav>
    </header>
  );
};

export default Navbar;
