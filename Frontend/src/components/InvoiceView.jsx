import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faArrowLeft,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);

  useEffect(() => {
    API.get(`/invoices/${id}`).then((r) => setInv(r.data));
  }, [id]);

  if (!inv) return <p className="text-center py-10">Loading...</p>;

  const total = Number(inv.total) || 0;
  const paid = Number(inv.paid) || 0;
  const due = total - paid;
  const giveBack = paid - total;

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div>
      {/* PRINT KE TIME YE BUTTON HIDE HO JAYENGE */}
      <div className="flex gap-2 mb-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-slate-200 px-4 py-2 rounded-xl font-bold text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm flex-1 sm:flex-none"
        >
          <FontAwesomeIcon icon={faPrint} /> Print / Save PDF
        </button>
      </div>

      {/* BILL PAPER */}
      <div className="bg-white max-w-md mx-auto p-6 rounded-2xl border-2 border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)] print:shadow-none print:border-0 print:rounded-none print:max-w-none print:p-0">
        {/* SHOP HEADER */}
        <div className="text-center border-b-2 border-dashed pb-4">
          <div className="bg-blue-100 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-blue-600 text-xl mb-2">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <h1 className="text-2xl font-extrabold">HisabKitab</h1>
          <p className="text-xs text-slate-500">
            Kirana Store • Thank You For Shopping
          </p>
        </div>

        {/* INVOICE INFO */}
        <div className="flex justify-between text-sm py-3 border-b">
          <div>
            <p className="text-slate-500 text-xs">Invoice No</p>
            <b>{inv.invoice_no}</b>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs">Date</p>
            <b>{formatDate(inv.created_at)}</b>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="py-3 border-b">
          <p className="text-xs text-slate-500">BILL TO</p>
          <b className="text-lg">{inv.naam}</b>
          <p className="text-sm text-slate-600">{inv.phone}</p>
        </div>

        {/* ITEM TABLE */}
        <table className="w-full text-sm my-3">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 font-semibold">{inv.product_name}</td>
              <td className="text-center">{inv.quantity}</td>
              <td className="text-right">₹{inv.price}</td>
              <td className="text-right font-bold">₹{total}</td>
            </tr>
          </tbody>
        </table>

        {/* TOTAL BOX */}
        <div className="space-y-1.5 text-sm border-t-2 border-dashed pt-3">
          <div className="flex justify-between">
            <span>Total</span>
            <b>₹{total}</b>
          </div>
          <div className="flex justify-between">
            <span>Paid ({inv.payment_mode})</span>
            <b className="text-green-600">₹{paid}</b>
          </div>
          {due > 0 && (
            <div className="flex justify-between text-red-600 font-bold text-base">
              <span>Due</span>
              <span>₹{due}</span>
            </div>
          )}
          {due < 0 && (
            <div className="flex justify-between text-green-600 font-bold text-base">
              <span>Give / Return</span>
              <span>₹{giveBack}</span>
            </div>
          )}
          {due === 0 && (
            <div className="flex justify-between text-green-600 font-bold">
              <span>Status</span>
              <span>PAID ✅</span>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          *** Thank You • Visit Again ***
        </p>
      </div>
    </div>
  );
}
