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
        `text-[13px] transition-colors ${
            location.pathname === path
                ? "font-semibold text-black underline decoration-[#3b68ff] decoration-2 underline-offset-4"
                : "text-black/40 hover:text-black"
        }`;

    return (
        <nav className="border-b border-black/10 bg-white">
            <div className="flex w-full items-center justify-between px-4 py-5 sm:px-6 md:px-8">
                <Link
                    to="/"
                    className="text-xl font-bold tracking-tight text-black underline"
                >
                    Nuke My<span className="text-[#3b68ff]"> BG</span>
                </Link>

                <div className="flex items-center gap-5">
                    <Link to="/" className={linkClass("/")}>
                        Home
                    </Link>

                    <Link to="/remove" className={linkClass("/remove")}>
                        Tool
                    </Link>

                    <Link to="/about" className={linkClass("/about")}>
                        About
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Nav;

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
