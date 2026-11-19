import { useState } from "react";
import { API } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faSave } from "@fortawesome/free-solid-svg-icons";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    rate: "",
    category: "",
    stock: "",
  });
  const navigate = useNavigate();

  const save = async () => {
    if (!form.name || !form.rate) return alert("Please enter Name and Rate");
    await API.post(
      `/products/?name=${encodeURIComponent(form.name)}&rate=${form.rate}&category=${encodeURIComponent(form.category)}&stock=${form.stock || 0}`,
    );
    alert("Product Added Successfully!");
    navigate("/products");
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-blue-100 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition max-w-md mx-auto mt-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
          <FontAwesomeIcon icon={faBoxOpen} />
        </span>
        <div>
          <h2 className="text-xl font-bold leading-none">Add New Product</h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill details to add product in stock
          </p>
        </div>
      </div>

      <label className="text-xs text-slate-500 font-medium">Product Name</label>
      <input
        className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder="Name - Parle-G"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label className="text-xs text-slate-500 font-medium">Rate</label>
      <input
        className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder="Rate - 10"
        type="number"
        onChange={(e) => setForm({ ...form, rate: e.target.value })}
      />

      <label className="text-xs text-slate-500 font-medium">Category</label>
      <input
        className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder="Category - Biscuit"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <label className="text-xs text-slate-500 font-medium">Stock</label>
      <input
        className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder="Stock - 100"
        type="number"
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />

      <button
        onClick={save}
        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faSave} /> Save Product
      </button>
    </div>
  );
}
