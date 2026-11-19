import { useEffect, useState } from "react";
import { API } from "../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faTrash,
  faMagnifyingGlass,
  faPen,
  faXmark,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

export default function ViewProduct() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    rate: "",
    category: "",
    stock: "",
  });

  const load = async () => {
    const r = await API.get("/products/?search=" + search);
    setList(r.data);
  };

  useEffect(() => {
    load();
  }, [search]);

  // Edit open karne pe form me purani value bhar do
  const openEdit = (p) => {
    setEditProduct(p);
    setEditForm({
      name: p.name,
      rate: p.rate,
      category: p.category || "",
      stock: p.stock,
    });
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.rate)
      return alert("Name and Rate required");
    await API.put(
      `/products/${editProduct.id}?name=${encodeURIComponent(editForm.name)}&rate=${editForm.rate}&category=${encodeURIComponent(editForm.category)}&stock=${editForm.stock}`,
    );
    setEditProduct(null);
    load();
  };

  return (
    <div className="relative">
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
        <h3 className="font-bold text-lg">
          <FontAwesomeIcon icon={faBoxOpen} className="text-blue-600" /> All
          Products
        </h3>

        <div className="relative mt-4">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-3.5 text-slate-400"
          />
          <input
            className="w-full p-2.5 pl-9 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 rounded-l-lg">Product</th>
                <th className="text-left">Category</th>
                <th className="text-right">Rate</th>
                <th className="text-right">Stock</th>
                <th className="rounded-r-lg"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="p-2 font-bold">{p.name}</td>
                  <td>{p.category}</td>
                  <td className="text-right font-bold">₹{p.rate}</td>
                  <td className="text-right">{p.stock}</td>
                  <td className="text-right py-2">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Delete this product?")) {
                            await API.delete("/products/" + p.id);
                            load();
                          }
                        }}
                        className="bg-red-100 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <p className="text-center text-slate-400 py-4">No product found</p>
        )}
      </div>

      {/* EDIT POPUP */}
      {editProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditProduct(null)}
        >
          <div
            className="bg-white w-full max-w-md p-5 rounded-2xl border-2 border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faPen} />
                </span>
                Edit Product
              </h3>
              <button
                onClick={() => setEditProduct(null)}
                className="bg-slate-100 w-8 h-8 rounded-lg"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <label className="text-xs text-slate-500 font-medium">
              Product Name
            </label>
            <input
              className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-3 outline-none focus:border-blue-500"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
            <label className="text-xs text-slate-500 font-medium">Rate</label>
            <input
              type="number"
              className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-3 outline-none focus:border-blue-500"
              value={editForm.rate}
              onChange={(e) =>
                setEditForm({ ...editForm, rate: e.target.value })
              }
            />
            <label className="text-xs text-slate-500 font-medium">
              Category
            </label>
            <input
              className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-3 outline-none focus:border-blue-500"
              value={editForm.category}
              onChange={(e) =>
                setEditForm({ ...editForm, category: e.target.value })
              }
            />
            <label className="text-xs text-slate-500 font-medium">Stock</label>
            <input
              type="number"
              className="border-2 border-slate-200 w-full p-2.5 rounded-xl mb-4 outline-none focus:border-blue-500"
              value={editForm.stock}
              onChange={(e) =>
                setEditForm({ ...editForm, stock: e.target.value })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 bg-slate-100 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
