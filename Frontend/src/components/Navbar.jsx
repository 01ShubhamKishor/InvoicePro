import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBoxOpen,
  faCirclePlus,
  faBars,
  faXmark,
  faCalculator,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setOpen(false);
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white text-blue-700 shadow"
      : "text-white hover:bg-blue-500 hover:text-white";

  const links = [
    { to: "/", label: "Dashboard", icon: faChartLine },
    { to: "/products", label: "View Product", icon: faBoxOpen },
    {
      to: "/add-product",
      label: "Add Product",
      icon: faCirclePlus,
      special: true,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 print:hidden w-full">
        <div className="bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600">
          <div className="w-full px-4 py-3 flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
              <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center shadow shrink-0">
                <FontAwesomeIcon
                  icon={faCalculator}
                  className="text-blue-600 text-lg"
                />
              </div>
              <div className="leading-none min-w-0">
                <span className="font-extrabold text-[18px] sm:text-xl tracking-tight block text-white truncate">
                  HisabKitab
                </span>
                <span className="text-[10px] sm:text-[11px] text-blue-200 tracking-widest whitespace-nowrap">
                  KIRANA STORE • BILLING
                </span>
              </div>
            </Link>

            {/* DESKTOP */}
            <nav className="hidden md:flex items-center gap-2 ml-auto shrink-0">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition ${isActive(l.to)} ${
                    l.special
                      ? "bg-yellow-400! text-slate-900! hover:bg-yellow-300! shadow-md"
                      : ""
                  }`}
                >
                  <FontAwesomeIcon icon={l.icon} />
                  {l.label}
                </Link>
              ))}
              <div className="flex items-center ml-3 pl-3 border-l border-blue-400/50">
                <button
                  onClick={logout}
                  className="bg-white text-red-600 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition active:scale-95 shadow-md cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </button>
              </div>
            </nav>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden bg-blue-700/80 w-10 h-10 min-w-10 rounded-lg flex items-center justify-center shrink-0"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg text-white" />
            </button>
          </div>
          <div className="bg-yellow-400 h-1"></div>
        </div>
      </header>

      {/* ===== MOBILE POPUP - AB CHHOTA, SIRF JITNA CHAHIYE UTNA ===== */}
      {open && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* YAHI FIX HAI - h-full HATA DIYA, ab height auto hai */}
          <div className="absolute top-3 right-3 w-70 bg-linear-to-b from-blue-700 via-blue-600 to-indigo-600 shadow-2xl rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-extrabold text-lg">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="bg-blue-700 w-8 h-8 rounded-lg flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faXmark} className="text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                    location.pathname === l.to
                      ? "bg-white text-blue-700"
                      : "bg-blue-700 text-white"
                  } ${l.special ? "bg-yellow-400! text-slate-900!" : ""}`}
                >
                  <FontAwesomeIcon icon={l.icon} />
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Logout - ab mt-auto NAHI hai, bilkul chipka hua */}
            <div className="pt-3 mt-3 border-t border-blue-400/40">
              <button
                onClick={logout}
                className="w-full bg-white text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow active:scale-95 transition"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
