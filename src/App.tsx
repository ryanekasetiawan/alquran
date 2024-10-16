import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quran from "./pages/Quran";
import SuratDetail from "./pages/SuratDetail";
import Doa from "./pages/Doa";
import DoaDetail from "./pages/DoaDetail";
import AsmaulHusna from "./pages/AsmaulHusna";
import PrayerTimesMonthly from "./pages/PrayerTimesMonthly";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
// import HaditsDailyModal from "./components/HaditsDailyModal";
import QuranDailyModal from "./components/QuranDailyModal";

function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      {/*<HaditsDailyModal />*/}
      <QuranDailyModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/quran/surat/:nomor" element={<SuratDetail />} />
        <Route path="/doa" element={<Doa />} />
        <Route path="/doa/:id" element={<DoaDetail />} />
        <Route path="/asmaul-husna" element={<AsmaulHusna />} />
        <Route path="/jadwal-salat" element={<PrayerTimesMonthly />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
