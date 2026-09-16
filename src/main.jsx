import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import About from "./About.jsx";
import Remove from "./Remove.jsx";

function Nav() {
  const location = useLocation();

  const linkClass = (path) =>
    `text-[13px] ${
      location.pathname === path
        ? "text-ink font-semibold underline text-[14-px]"
        : "text-mute hover:text-ink"
    }`;

  return (
    <nav className="max-w-[960px] mx-auto px-6 py-3 flex gap-5">
      <Link to="/" className={linkClass("/")}>
        Home
      </Link>
      <Link to="/remove" className={linkClass("/remove")}>
        Tool
      </Link>
      <Link to="/about" className={linkClass("/about")}>
        About
      </Link>
    </nav>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/remove" element={<Remove />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
