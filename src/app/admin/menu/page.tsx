"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/format";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, X, Loader2, Check, Leaf, Drumstick } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
}

interface ProductCategory {
  category: { id: string; slug: string; name: string };
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  active: boolean;
  signature: boolean;
  tag: string | null;
  veg: boolean;
  vegan: boolean;
  sortOrder: number;
  categories: ProductCategory[];
}

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  active: true,
  signature: false,
  tag: "",
  veg: true,
  vegan: false,
  categoryIds: [] as string[],
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Category form
  const [catForm, setCatForm] = useState({ name: "", slug: "" });
  const [catLoading, setCatLoading] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);

  // Product drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [drawerError, setDrawerError] = useState("");

  const fetchAll = useCallback(async () => {
    const [catRes, prodRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/products"),
    ]);
    setCategories(await catRes.json());
    setProducts(await prodRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Category actions
  async function saveCategory() {
    setCatLoading(true);
    const url = editCat ? `/api/admin/categories/${editCat.id}` : "/api/admin/categories";
    const method = editCat ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catForm.name, slug: catForm.slug }),
    });
    setCatForm({ name: "", slug: "" });
    setEditCat(null);
    setCatLoading(false);
    fetchAll();
  }

  async function toggleCategoryActive(cat: Category) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !cat.active }),
    });
    fetchAll();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category? Products will be unlinked.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchAll();
  }

  // Product drawer
  function openCreate() {
    setDrawerMode("create");
    setEditProduct(null);
    setForm(emptyProduct);
    setDrawerError("");
    setDrawerOpen(true);
  }

  function openEdit(p: Product) {
    setDrawerMode("edit");
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price / 100),
      imageUrl: p.imageUrl ?? "",
      active: p.active,
      signature: p.signature,
      tag: p.tag ?? "",
      veg: p.veg,
      vegan: p.vegan,
      categoryIds: p.categories.map((c) => c.category.id),
    });
    setDrawerError("");
    setDrawerOpen(true);
  }

  async function saveProduct() {
    setDrawerError("");
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setDrawerError("Enter a valid price in ₹");
      return;
    }
    setSaving(true);
    const body = {
      name: form.name,
      description: form.description || undefined,
      price: Math.round(priceNum * 100),
      imageUrl: form.imageUrl || undefined,
      active: form.active,
      signature: form.signature,
      tag: form.tag || undefined,
      veg: form.veg,
      vegan: form.vegan,
      categoryIds: form.categoryIds,
    };
    const url = drawerMode === "edit" && editProduct ? `/api/admin/products/${editProduct.id}` : "/api/admin/products";
    const method = drawerMode === "edit" ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) {
      setDrawerOpen(false);
      fetchAll();
    } else {
      setDrawerError("Failed to save. Check your inputs.");
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchAll();
  }

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "all" || p.categories.some((c) => c.category.id === filterCat);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display text-[#1A0B04] font-medium mb-8" style={{ fontSize: "2rem" }}>
        Menu Management
      </h1>

      {/* Categories */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-[#1A0B04] text-sm uppercase tracking-widest">
            Categories
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border font-sans text-sm",
                cat.active ? "bg-white border-[#CFC0A0] text-[#1A0B04]" : "bg-[#F4ECD9] border-[#CFC0A0] text-[#9A7A56] line-through"
              )}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-[#9A7A56]">({cat._count?.products ?? 0})</span>
              <button onClick={() => { setEditCat(cat); setCatForm({ name: cat.name, slug: cat.slug }); }} className="text-[#9A7A56] hover:text-[#B86B1A]"><Pencil size={11} /></button>
              <button onClick={() => toggleCategoryActive(cat)} className="text-[#9A7A56] hover:text-[#B86B1A]">
                {cat.active ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
              </button>
              <button onClick={() => deleteCategory(cat.id)} className="text-[#9A7A56] hover:text-red-500"><Trash2 size={11} /></button>
            </div>
          ))}
        </div>

        {/* Add/edit category inline */}
        <div className="flex gap-2 items-end">
          <div>
            <label className="block font-sans text-xs text-[#9A7A56] mb-1">Category Name</label>
            <input
              value={catForm.name}
              onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value, slug: editCat ? f.slug : e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
              className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] w-44"
              placeholder="e.g. Cold Coffee"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-[#9A7A56] mb-1">Slug</label>
            <input
              value={catForm.slug}
              onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
              className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] w-36"
              placeholder="cold-coffee"
            />
          </div>
          <button
            onClick={saveCategory}
            disabled={!catForm.name || !catForm.slug || catLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold disabled:opacity-40 hover:bg-[#B86B1A] transition-colors"
          >
            {catLoading ? <Loader2 size={14} className="animate-spin" /> : editCat ? <Check size={14} /> : <Plus size={14} />}
            {editCat ? "Update" : "Add Category"}
          </button>
          {editCat && (
            <button onClick={() => { setEditCat(null); setCatForm({ name: "", slug: "" }); }} className="p-2 rounded-xl border border-[#CFC0A0] text-[#9A7A56] hover:text-[#1A0B04]"><X size={14} /></button>
          )}
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-sans font-semibold text-[#1A0B04] text-sm uppercase tracking-widest">
            Products ({filtered.length})
          </h2>
          <div className="flex gap-2 items-center flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] w-44"
            />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#B86B1A] text-white rounded-xl font-sans text-sm font-semibold hover:bg-[#9A5912] transition-colors"
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <p className="font-sans text-sm text-[#9A7A56]">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-center py-12 font-sans text-sm text-[#9A7A56]">No products found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EDE1C8] bg-[#F4ECD9]">
                    <th className="text-left px-4 py-3 font-sans text-xs text-[#9A7A56] uppercase tracking-widest">Item</th>
                    <th className="text-left px-4 py-3 font-sans text-xs text-[#9A7A56] uppercase tracking-widest hidden sm:table-cell">Categories</th>
                    <th className="text-right px-4 py-3 font-sans text-xs text-[#9A7A56] uppercase tracking-widest">Price</th>
                    <th className="text-center px-4 py-3 font-sans text-xs text-[#9A7A56] uppercase tracking-widest hidden md:table-cell">Diet</th>
                    <th className="text-center px-4 py-3 font-sans text-xs text-[#9A7A56] uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-[#EDE1C8] last:border-0 hover:bg-[#F4ECD9]/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#EDE1C8]">
                              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="40px" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#EDE1C8] shrink-0" />
                          )}
                          <div>
                            <p className="font-sans text-sm font-medium text-[#1A0B04]">{p.name}</p>
                            {p.signature && (
                              <span className="font-sans text-[10px] text-[#B86B1A] bg-[#B86B1A]/10 px-1.5 py-0.5 rounded-full">Signature</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.categories.map((c) => (
                            <span key={c.category.id} className="font-sans text-[10px] bg-[#EDE1C8] text-[#5A3A1E] px-2 py-0.5 rounded-full">
                              {c.category.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-display italic text-[#B86B1A]" style={{ fontSize: "0.95rem" }}>
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        {p.vegan ? <Leaf size={14} className="text-emerald-600 mx-auto" /> : p.veg ? <Leaf size={14} className="text-green-500 mx-auto" /> : <Drumstick size={14} className="text-red-500 mx-auto" />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("font-sans text-xs px-2 py-0.5 rounded-full font-semibold", p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                          {p.active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-[#9A7A56] hover:text-[#B86B1A] hover:bg-[#EDE1C8] transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg text-[#9A7A56] hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>

      {/* Product drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col">
            <div className="px-6 py-5 border-b border-[#EDE1C8] flex items-center justify-between">
              <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.4rem" }}>
                {drawerMode === "create" ? "New Product" : "Edit Product"}
              </h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl hover:bg-[#EDE1C8] text-[#9A7A56]"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 space-y-4 flex-1">
              <Field label="Name">
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputCls} placeholder="Biscoff Latte" />
              </Field>

              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={cn(inputCls, "h-20 resize-none")} placeholder="A short description…" />
              </Field>

              <Field label="Price (₹)">
                <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className={inputCls} placeholder="295" min="1" step="1" />
              </Field>

              <Field label="Image URL">
                <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  className={inputCls} placeholder="https://images.unsplash.com/…" />
                {form.imageUrl && (
                  <div className="relative w-full h-32 mt-2 rounded-xl overflow-hidden bg-[#EDE1C8]">
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover" sizes="400px"
                      onError={() => setForm((f) => ({ ...f, imageUrl: "" }))} />
                  </div>
                )}
              </Field>

              <Field label="Tag (optional)">
                <input value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                  className={inputCls} placeholder="Must Try, Fan Favourite…" />
              </Field>

              <Field label="Categories">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm((f) => ({
                        ...f,
                        categoryIds: f.categoryIds.includes(cat.id)
                          ? f.categoryIds.filter((id) => id !== cat.id)
                          : [...f.categoryIds, cat.id],
                      }))}
                      className={cn(
                        "px-3 py-1 rounded-full border font-sans text-xs transition-colors",
                        form.categoryIds.includes(cat.id)
                          ? "bg-[#B86B1A] border-[#B86B1A] text-white"
                          : "bg-white border-[#CFC0A0] text-[#5A3A1E] hover:border-[#B86B1A]"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Toggle label="Vegetarian" value={form.veg} onChange={(v) => setForm((f) => ({ ...f, veg: v, vegan: v ? f.vegan : false }))} />
                <Toggle label="Vegan" value={form.vegan} onChange={(v) => setForm((f) => ({ ...f, vegan: v, veg: v ? true : f.veg }))} />
                <Toggle label="Signature" value={form.signature} onChange={(v) => setForm((f) => ({ ...f, signature: v }))} />
                <Toggle label="Active" value={form.active} onChange={(v) => setForm((f) => ({ ...f, active: v }))} />
              </div>

              {drawerError && (
                <p className="font-sans text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{drawerError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#EDE1C8]">
              <button
                onClick={saveProduct}
                disabled={saving || !form.name}
                className="w-full flex items-center justify-center gap-2 bg-[#1A0B04] text-white font-sans text-sm font-semibold py-3 rounded-xl hover:bg-[#B86B1A] transition-colors disabled:opacity-40"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {drawerMode === "create" ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs text-[#9A7A56] mb-1.5 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "flex items-center justify-between px-4 py-2.5 rounded-xl border font-sans text-sm transition-colors",
        value ? "bg-[#1A0B04] border-[#1A0B04] text-white" : "bg-white border-[#CFC0A0] text-[#5A3A1E]"
      )}
    >
      {label}
      {value && <Check size={14} />}
    </button>
  );
}
