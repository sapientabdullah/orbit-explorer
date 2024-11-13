import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SolarSystem from "./components/SolarSystem";
import Mercury from "./components/Mercury";
import Sun from "./components/Sun";
import Earth from "./components/Earth";
import Uranus from "./components/Uranus";
import Navbar from "./components/Navbar";
import Jupiter from "./components/Jupiter";
import Venus from "./components/Venus";
import Mars from "./components/Mars";
import Pluto from "./components/Pluto";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SolarSystem />} />
        <Route path="/sun" element={<Sun />} />
        <Route path="/mercury" element={<Mercury />} />
        <Route path="/earth" element={<Earth />} />
        <Route path="/uranus" element={<Uranus />} />
        <Route path="/jupiter" element={<Jupiter />} />
        <Route path="/venus" element={<Venus />} />
        <Route path="/mars" element={<Mars />} />
        <Route path="/pluto" element={<Pluto />} />
      </Routes>
    </Router>
  );
}
