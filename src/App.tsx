import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alquran from "./pages/Alquran";
import Doa from "./pages/Doa";
import AsmaulHusna from "./pages/AsmaulHusna";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alquran" element={<Alquran />} />
        <Route path="/doa" element={<Doa />} />
        <Route path="/asmaul-husna" element={<AsmaulHusna />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
