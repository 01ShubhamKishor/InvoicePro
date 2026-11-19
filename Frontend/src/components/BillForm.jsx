import { useState } from "react";
import { API } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faSave,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";

export default function BillForm({ onSaved }) {
  const [form, setForm] = useState({
    naam: "",
    phone: "",
    product_name: "",
    quantity: "",
    price: "",
    paid: "",
    payment_mode: "CASH",
  });
  const [suggest, setSuggest] = useState([]);

  // "" ko 0 maano calculation ke liye, par input me 0 mat dikhao
  const qty = Number(form.quantity) || 0;
  const price = Number(form.price) || 0;
  const paid = Number(form.paid) || 0;

  const total = qty * price;
  const due = total - paid;
  const giveBack = paid - total; // Paid jyada hai to ye positive hoga

  const search = async (v) => {
    setForm({ ...form, product_name: v });
    if (!v) {
      setSuggest([]);
      return;
    }
    const r = await API.get("/products/?search=" + v);
    setSuggest(r.data);
  };

  const save = async () => {
    if (!form.naam || !form.phone || !form.product_name)
      return alert("Please fill Name, Phone and Product");
    if (qty <= 0) return alert("Quantity 0 nahi ho sakti");
    try {
      const payload = {
        ...form,
        quantity: qty,
        price: price,
        paid: paid,
      };
      const r = await API.post("/invoices/", payload);
      alert(`Done! ${r.data.invoice_no} | Total ₹${r.data.total}`);
      setForm({
        naam: "",
        phone: "",
        product_name: "",
        quantity: "",
        price: "",
        paid: "",
        payment_mode: "CASH",
      });
      setSuggest([]);
      if (onSaved) onSaved();
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data);
      const detail = err.response?.data?.detail;
      let msg = "Something went wrong";
      if (typeof detail === "string") msg = detail;
      else if (Array.isArray(detail))
        msg = detail.map((d) => `${d.loc?.[1]} - ${d.msg}`).join("\n");
      alert("Error: " + msg);
    }
  };

  const inputCls =
    "w-full p-2.5 border-2 border-slate-200 rounded-xl mt-1 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100";
  const labelCls = "text-xs text-slate-500 mt-3 block font-medium";

  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
      <h3 className="font-bold text-lg mb-2">
        <FontAwesomeIcon icon={faPlus} className="text-green-600" /> New Bill
      </h3>
      <label className={labelCls}>Customer Name</label>
      <input
        className={inputCls}
        value={form.naam}
        onChange={(e) => setForm({ ...form, naam: e.target.value })}
        placeholder="Rahul Sharma"
      />
      <label className={labelCls}>Phone</label>
      <input
        className={inputCls}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="9876543210"
      />
      <label className={labelCls}>
        <FontAwesomeIcon icon={faMagnifyingGlass} /> Search Product
      </label>
      <input
        className={inputCls}
        value={form.product_name}
        onChange={(e) => search(e.target.value)}
        placeholder="Type Parle..."
      />
      {suggest.length > 0 && (
        <div className="border-2 border-slate-200 rounded-xl mt-1 overflow-hidden">
          {suggest.map((p) => (
            <div
              key={p.id}
              className="p-2.5 flex justify-between cursor-pointer hover:bg-slate-50 border-b last:border-0"
              onClick={() => {
                setForm({
                  ...form,
                  product_name: p.name,
                  price: String(p.rate),
                  quantity: form.quantity === "" ? "1" : form.quantity,
                });
                setSuggest([]);
              }}
            >
              <span>
                {p.name}{" "}
                <small className="text-slate-400">
                  {p.category} • Stock {p.stock}
                </small>
              </span>
              <b>₹{p.rate}</b>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Quantity</label>
          <input
            type="number"
            placeholder="0"
            className={inputCls}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Price (Per Unit)</label>
          <input
            type="number"
            placeholder="0"
            className={inputCls}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Paid</label>
          <input
            type="number"
            placeholder="0"
            className={inputCls}
            value={form.paid}
            onChange={(e) => setForm({ ...form, paid: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>Payment Mode</label>
          <select
            className={inputCls}
            value={form.payment_mode}
            onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
          >
            <option>CASH</option>
            <option>UPI</option>
            <option>MIX</option>
          </select>
        </div>
      </div>

      {/* TOTAL / DUE / GIVE BOX */}
      <div
        className={`p-3 rounded-xl mt-3 flex justify-between font-bold border-2 ${due < 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
      >
        <span>Total: ₹{total}</span>
        {due < 0 ? (
          <span className="text-green-600 flex items-center gap-1">
            <FontAwesomeIcon icon={faHandHoldingDollar} /> Give: ₹{giveBack}
          </span>
        ) : due === 0 && total > 0 ? (
          <span className="text-green-600">Paid ✅</span>
        ) : (
          <span className="text-red-600">Due: ₹{due}</span>
        )}
      </div>

      {/* Agar jyada paisa diya hai to neeche bhi clear dikhega */}
      {due < 0 && (
        <p className="text-xs text-green-600 mt-2 text-center font-semibold">
          Customer ne ₹{giveBack} jyada diya hai • Customer ko ₹{giveBack} wapas
          dena hai
        </p>
      )}

      <button
        onClick={save}
        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold mt-3 shadow-lg shadow-green-200"
      >
        <FontAwesomeIcon icon={faSave} /> Save Bill
      </button>
    </div>
  );
}
