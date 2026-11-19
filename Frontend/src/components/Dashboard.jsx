import { useEffect, useState } from "react";
import { API } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupeeSign,
  faWallet,
  faCircleExclamation,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";
import BillForm from "../components/BillForm";
import BillList from "../components/BillList";

export default function Dashboard() {
  const [d, setD] = useState({ total_sale: 0, total_paid: 0, total_due: 0 });
  const [today, setToday] = useState({ aaj_ke_bills: 0, aaj_ki_sale: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  const load = () => {
    API.get("/invoices/dashboard/summary").then((r) => setD(r.data));
    API.get("/invoices/dashboard/today").then((r) => setToday(r.data));
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  // YAHI MAIN FIX HAI
  const rawDue = Number(d.total_due) || 0;
  const pendingDue = rawDue > 0 ? rawDue : 0; // Due kabhi minus nahi dikhega
  const giveBack = rawDue < 0 ? Math.abs(rawDue) : 0; // Jyada paisa hai to ye niklega

  return (
    <div className="space-y-4">
      {/* TOP 3 CARDS - SIRF DESKTOP PE DIKHEGA, MOBILE PE HIDDEN */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
          <small className="text-slate-500 flex items-center gap-2 text-[13px] font-medium">
            <span className="bg-blue-100 text-blue-600 w-7 h-7 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faIndianRupeeSign} />
            </span>
            Total Sale
          </small>
          <b className="text-[28px] leading-none text-blue-600 block mt-3">
            ₹{d.total_sale}
          </b>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-green-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
          <small className="text-slate-500 flex items-center gap-2 text-[13px] font-medium">
            <span className="bg-green-100 text-green-600 w-7 h-7 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faWallet} />
            </span>
            Received
          </small>
          <b className="text-[28px] leading-none text-green-600 block mt-3">
            ₹{d.total_paid}
          </b>
        </div>

        {/* 3rd CARD - DUE / GIVE */}
        {giveBack > 0 ? (
          <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            <small className="text-green-700 flex items-center gap-2 text-[13px] font-medium">
              <span className="bg-green-100 text-green-600 w-7 h-7 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faHandHoldingDollar} />
              </span>
              Give / Return
            </small>
            <b className="text-[28px] leading-none text-green-600 block mt-3">
              ₹{giveBack}
            </b>
            <p className="text-[11px] text-green-600 font-semibold mt-1">
              Customer ko wapas dena hai
            </p>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border-2 border-red-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            <small className="text-slate-500 flex items-center gap-2 text-[13px] font-medium">
              <span className="bg-red-100 text-red-600 w-7 h-7 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleExclamation} />
              </span>
              Pending / Due
            </small>
            <b className="text-[28px] leading-none text-red-600 block mt-3">
              ₹{pendingDue}
            </b>
          </div>
        )}
      </div>

      {/* TODAY STRIP */}
      <div className="bg-white border border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-2xl px-5 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Today's Summary
        </span>
        <span className="text-sm text-slate-600">
          <b className="text-slate-900">{today.aaj_ke_bills} bills</b> •{" "}
          <b className="text-slate-900">₹{today.aaj_ki_sale} sale</b>
        </span>
      </div>

      {/* BILL FORM + BILL LIST */}
      <div className="bg-slate-50 border border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.06)] rounded-2xl p-3 sm:p-4 space-y-4">
        <BillForm onSaved={() => setRefreshKey((k) => k + 1)} />
        <BillList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
