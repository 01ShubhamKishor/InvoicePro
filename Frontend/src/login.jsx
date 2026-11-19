import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faStore,
  faUser,
  faLock,
  faRightToBracket,
  faIndianRupeeSign,
  faReceipt,
  faBoxesStacked,
} from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password)
      return alert("Username aur Password dono daalo");
    setLoading(true);
    try {
      const r = await API.post(
        `/auth/login?username=${username}&password=${password}`,
      );
      localStorage.setItem("token", r.data.access_token);
      localStorage.setItem("username", r.data.username);
      navigate("/");
    } catch {
      alert("Wrong username / password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* LEFT SIDE - SHOP / BRANDING - Desktop pe dikhega */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col justify-between p-10 text-white">
        {/* Background Circles - Dukaan wali feel */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-400/20 rounded-full blur-2xl"></div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon
                icon={faCalculator}
                className="text-blue-600 text-2xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold leading-none">
                HisabKitab
              </h1>
              <p className="text-[11px] tracking-[0.25em] text-blue-200">
                KIRANA STORE • BILLING
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4">
            <FontAwesomeIcon icon={faStore} /> APNI DUKAAN • APNA HISAB
          </div>
          <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.1]">
            Dukaan ka hisab,
            <br />
            ab <span className="text-yellow-300">ekdum aasan.</span>
          </h2>
          <p className="text-blue-100 mt-4 max-w-md leading-relaxed">
            Bill banao, udhaar track karo, aur roz ka collection dekho. Sab kuch
            ek jagah, bina copy-pen ke jhanjhat ke.
          </p>

          {/* 3 Features */}
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
              <FontAwesomeIcon
                icon={faReceipt}
                className="text-yellow-300 text-xl mb-2"
              />
              <p className="font-bold text-sm">Fast Billing</p>
              <p className="text-xs text-blue-200">2 sec me bill</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="text-yellow-300 text-xl mb-2"
              />
              <p className="font-bold text-sm">Udhaar Track</p>
              <p className="text-xs text-blue-200">Kispe kitna baki</p>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
              <FontAwesomeIcon
                icon={faBoxesStacked}
                className="text-yellow-300 text-xl mb-2"
              />
              <p className="font-bold text-sm">Stock</p>
              <p className="text-xs text-blue-200">Product manage</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-blue-300">
          © 2026 HisabKitab • Made for Kirana Stores
        </p>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-linear-to-br from-slate-50 to-blue-50 lg:bg-white">
        {/* Mobile pe background gradient */}
        <div className="lg:hidden absolute inset-0 bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700"></div>
        <div className="lg:hidden absolute -top-20 -right-20 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl"></div>

        <div className="relative w-full max-w-md bg-white p-6 sm:p-8 rounded-[28px] shadow-2xl border border-slate-100">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-5">
            <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-2">
              <FontAwesomeIcon
                icon={faCalculator}
                className="text-white text-2xl"
              />
            </div>
            <h1 className="text-2xl font-extrabold">HisabKitab</h1>
            <p className="text-[11px] tracking-[0.25em] text-slate-400">
              KIRANA STORE • BILLING
            </p>
          </div>

          <h2 className="text-2xl font-extrabold hidden lg:block">
            Welcome Back 👋
          </h2>
          <p className="text-slate-500 text-sm hidden lg:block mt-1 mb-6">
            Apni dukaan ka hisab dekhne ke liye login karo
          </p>
          <p className="text-center text-slate-500 text-sm lg:hidden mb-5">
            Login karke apna hisab dekho
          </p>

          {/* Username */}
          <label className="text-xs font-bold text-slate-600">USERNAME</label>
          <div className="flex items-center gap-2 border-2 border-slate-200 rounded-xl px-3 mb-4 mt-1 focus-within:border-blue-500 bg-slate-50">
            <FontAwesomeIcon icon={faUser} className="text-slate-400" />
            <input
              className="w-full py-3 bg-transparent outline-none text-sm font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          {/* Password */}
          <label className="text-xs font-bold text-slate-600">PASSWORD</label>
          <div className="flex items-center gap-2 border-2 border-slate-200 rounded-xl px-3 mb-5 mt-1 focus-within:border-blue-500 bg-slate-50">
            <FontAwesomeIcon icon={faLock} className="text-slate-400" />
            <input
              type="password"
              className="w-full py-3 bg-transparent outline-none text-sm font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Login ho raha hai..."
            ) : (
              <>
                {" "}
                <FontAwesomeIcon icon={faRightToBracket} /> Login{" "}
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[11px] text-slate-400 font-semibold">
              DEMO LOGIN
            </span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button
            onClick={() => {
              setUsername("admin");
              setPassword("1234");
            }}
            className="w-full bg-yellow-50 border-2 border-dashed border-yellow-300 text-slate-700 py-2.5 rounded-xl text-sm font-bold"
          >
            Demo ke liye: <span className="text-blue-600">admin / 1234</span>{" "}
            bharo
          </button>

          <p className="text-center text-[11px] text-slate-400 mt-5">
            Password bhool gaye? Admin se sampark karein.
          </p>
        </div>
      </div>
    </div>
  );
}
