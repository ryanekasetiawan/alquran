import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alquran from "./pages/Alquran";
import Doa from "./pages/Doa";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alquran" element={<Alquran />} />
        <Route path="/doa" element={<Doa />} />
      </Routes>
    </>
  );
}

export default App;
