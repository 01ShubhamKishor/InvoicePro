import { useEffect, useState } from "react";
import { API } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faList,
  faFileInvoice,
  faCheckCircle,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";

export default function BillList({ refreshKey }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const load = async () => {
    const r = await API.get("/invoices/?search=" + search);
    setList([...r.data].reverse());
  };

  useEffect(() => {
    load();
  }, [search, refreshKey]);

  // Date-Time format karne ke liye
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
      <h3 className="font-bold text-lg">
        <FontAwesomeIcon icon={faList} /> All Bills / Pending Bills
      </h3>

      <input
        className="w-full p-2.5 border-2 border-slate-200 rounded-xl my-3 outline-none focus:border-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Name or Phone..."
      />

      {list.map((i) => {
        // Backend se due negative aa sakta hai, usko yahi handle kar liya
        const total = Number(i.total) || 0;
        const paid = Number(i.paid) || 0;
        const due = total - paid; // backend wale due se bharosa nahi, khud nikaal liya
        const giveBack = paid - total;

        return (
          <div
            key={i.id}
            className={`border-2 rounded-xl p-3 mb-2 flex justify-between gap-2 ${
              due < 0
                ? "border-green-200 bg-green-50/50"
                : due > 0
                  ? "border-red-100"
                  : "border-slate-200"
            }`}
          >
            <div>
              <b>
                {i.naam} - {i.product_name}
              </b>
              <small className="block text-slate-500">
                {i.phone} • {i.invoice_no} • {i.quantity} x ₹{i.price} •{" "}
                {i.payment_mode}
              </small>
              <small className="block text-slate-500">
                {formatDate(i.created_at)}
              </small>
              <small>
                Total ₹{total} •{" "}
                <span className="text-green-600 font-bold">Paid ₹{paid}</span> •{" "}
                {due < 0 ? (
                  <span className="text-green-600 font-bold">
                    Give: ₹{giveBack}
                  </span>
                ) : due > 0 ? (
                  <span className="text-red-600 font-bold">Due ₹{due}</span>
                ) : (
                  <span className="text-green-600 font-bold">Paid ✅</span>
                )}
              </small>

              {/* Jyada paisa diya hai to neeche clear likh dega */}
              {due < 0 && (
                <div className="text-[11px] text-green-700 font-semibold mt-1 bg-green-100 px-2 py-1 rounded-lg inline-block">
                  <FontAwesomeIcon icon={faHandHoldingDollar} /> Customer ko ₹
                  {giveBack} wapas diya
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              {due > 0 ? (
                <button
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  onClick={async () => {
                    const amt = prompt(`Due ₹${due}`, due);
                    if (!amt) return;
                    await API.post(
                      `/invoices/${i.id}/pay?amount=${amt}&payment_mode=CASH`,
                    );
                    load();
                  }}
                >
                  Received Due ₹{due}
                </button>
              ) : due < 0 ? (
                <button className="bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <FontAwesomeIcon icon={faHandHoldingDollar} /> Give ₹
                  {giveBack}
                </button>
              ) : (
                <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs">
                  <FontAwesomeIcon icon={faCheckCircle} /> Clear
                </button>
              )}
              <button
                className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs"
                onClick={() => navigate(`/invoice/${i.id}`)}
              >
                <FontAwesomeIcon icon={faFileInvoice} /> View Bill
              </button>
            </div>
          </div>
        );
      })}

      {list.length === 0 && "No bills found"}
    </div>
  );
}
