import { Link } from "react-router-dom";
import { FaQuran } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-white sticky top-0 z-10 mb-5">
      <div className="max-w-full mx-auto px-12 py-4 flex justify-between items-center">
        <Link to="/" className="flex gap-3">
          <FaQuran className="text-4xl text-[#3daa25]" />
          <h1 className="text-slate-700 font-bold text-4xl">Al-Qur'an</h1>
        </Link>

        <ul className="flex space-x-4 text-slate-500">
          <li>
            <Link
              to="/alquran"
              className="hover:underline hover:text-[#3daa25]"
            >
              Al-Qur'an
            </Link>
          </li>
          <li>
            <Link to="/doa" className="hover:underline hover:text-[#3daa25]">
              Doa
            </Link>
          </li>
          {/* Menu Services dengan Dropdown */}
          <li className="relative group">
            <Link
              to="#services"
              className="hover:underline hover:text-[#3daa25]"
            >
              Services
            </Link>
            {/* Dropdown dengan animasi */}
            <ul className="absolute left-0 top-full mt-5 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 transform scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:visible invisible transition-all duration-300 ease-in-out">
              <li className="px-4 py-2 hover:bg-gray-100 hover">
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
            {/* Invisible hover trigger untuk menjaga hover tetap aktif */}
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
      </div>
    </nav>
  );
};

export default Navbar;
