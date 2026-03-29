import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../services/productService";

const initialForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  weight: "",
  images: "",
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Nu am putut încărca produsele.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      await createProduct({
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        weight: form.weight,
        images: form.images ? [form.images] : [],
        flavors: [],
        dietary: [],
        allergens: [],
        occasion: [],
        isAvailable: true,
      });

      setForm(initialForm);
      setMessage("Produs creat cu succes.");
      fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message || "Eroare la crearea produsului."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setMessage("");
      await deleteProduct(id);
      setMessage("Produs șters.");
      fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message || "Eroare la ștergerea produsului."
      );
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A67C52]">
          Admin dashboard
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#2B2B2B]">
          Administrare produse
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#5B2E2E]">Adaugă produs</h2>

          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nume produs"
              className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
              required
            />

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="slug-produs"
              className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descriere"
              rows={4}
              className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                placeholder="Preț"
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
                required
              />
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                placeholder="Stoc"
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Categorie"
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
                required
              />
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="Greutate ex: 1kg"
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
              />
            </div>

            <input
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="URL imagine"
              className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-[#5B2E2E] py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Se salvează..." : "Adaugă produs"}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-neutral-600">{message}</p>}
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#5B2E2E]">Produse existente</h2>

          {loading ? (
            <p className="mt-6 text-neutral-500">Se încarcă produsele...</p>
          ) : (
            <div className="mt-6 space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-[#F7F3EE] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images?.[0] || "https://dummyimage.com/100x100"}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-[#2B2B2B]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {product.price} RON · Stoc: {product.stock}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Șterge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}