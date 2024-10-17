import PrayerTimes from "@/components/PrayerTimes";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" bg-slate-900 py-8 mt-12 ">
      <div className="w-full">
        <div className="flex flex-col justify-center mb-5">
          <div className="flex lg:justify-start mb-5 px-5 md:px-12 lg:gap-20 text-white">
            <div className="hidden lg:flex flex-col gap-2">
              <div className="font-bold text-xl">Navigasi</div>
              <Link to="/" className="hover:text-[#3daa25]">
                Al-Qur’an & Tafsir
              </Link>
              <Link to="/doa" className="hover:text-[#3daa25]">
                Doa
              </Link>
              <Link to="/asmaul-husna" className="hover:text-[#3daa25]">
                Asmaul Husna
              </Link>
            </div>
            <PrayerTimes />
          </div>
          <hr className="border-0 h-[1px] bg-gray-600" />
        </div>
        <div className="flex flex-col items-center justify-between">
          <div className="text-gray-400 text-sm">
            Copyright &copy; Ryan Eka Setiawan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
