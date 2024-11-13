import { Link } from "react-router-dom";
import { planets } from "../constants/planetsConstants";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        zIndex: 10,
      }}
    >
      <h1 style={{ color: "#fff", marginRight: "auto" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
          Orbit Explorer
        </Link>
      </h1>
      {planets.map((planet) => (
        <button
          key={planet.name}
          onClick={() => navigate(planet.path)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
            textDecoration: "none",
          }}
        >
          {planet.name}
        </button>
      ))}
    </nav>
  );
}
