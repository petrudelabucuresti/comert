import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  updatePaymentStatusAdmin,
} from "../services/orderService";
import { Package, ShoppingCart, RefreshCcw, Trash2 } from "lucide-react";

const ORDER_STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUS_OPTIONS = ["all", "pending", "paid", "failed"];

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
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [searchProduct, setSearchProduct] = useState("");
  const [stockInputs, setStockInputs] = useState({});

  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  const clearFeedback = () => {
    setMessage("");
    setError("");
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);

    try {
      clearFeedback();
      const res = await getProducts();
      const allProducts = res.data || [];
      setProducts(allProducts);

      const initialStock = {};
      allProducts.forEach((product) => {
        initialStock[product.id] = {
          amount: "",
          directStock: product.stock ?? 0,
        };
      });
      setStockInputs(initialStock);
    } catch (error) {
      console.error(error);
      setError("Nu am putut încărca produsele.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);

    try {
      clearFeedback();
      const res = await getAllOrdersAdmin();
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      setError("Nu am putut încărca comenzile.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStockInputChange = (productId, field, value) => {
    setStockInputs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      clearFeedback();

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
        isAvailable: Number(form.stock) > 0,
      });

      setForm(initialForm);
      setMessage("Produs creat cu succes.");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Eroare la crearea produsului.");
    } finally {
      setSaving(false);
    }
  };

  const updateProductStock = async (productId, newStock) => {
    try {
      clearFeedback();

      const safeStock = Math.max(0, Number(newStock));

      await updateProduct(productId, {
        stock: safeStock,
        isAvailable: safeStock > 0,
      });

      setMessage("Stoc actualizat cu succes.");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Nu s-a putut actualiza stocul.");
    }
  };

  const handleAddStock = async (product) => {
    const amount = Number(stockInputs[product.id]?.amount || 0);

    if (!amount || amount < 1) {
      setError("Introdu o cantitate validă pentru adăugare.");
      return;
    }

    await updateProductStock(product.id, Number(product.stock || 0) + amount);
  };

  const handleSubtractStock = async (product) => {
    const amount = Number(stockInputs[product.id]?.amount || 0);

    if (!amount || amount < 1) {
      setError("Introdu o cantitate validă pentru scădere.");
      return;
    }

    await updateProductStock(
      product.id,
      Math.max(0, Number(product.stock || 0) - amount)
    );
  };

  const handleSetExactStock = async (product) => {
    const exactStock = Number(stockInputs[product.id]?.directStock);

    if (Number.isNaN(exactStock) || exactStock < 0) {
      setError("Stocul trebuie să fie minim 0.");
      return;
    }

    await updateProductStock(product.id, exactStock);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Sigur vrei să ștergi produsul?");
    if (!confirmed) return;

    try {
      clearFeedback();
      await deleteProduct(id);
      setMessage("Produs șters.");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Eroare la ștergerea produsului.");
    }
  };

  const handleOrderStatusChange = async (orderId, orderStatus) => {
    try {
      clearFeedback();
      await updateOrderStatusAdmin(orderId, orderStatus);
      setMessage("Statusul comenzii a fost actualizat.");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          "Eroare la actualizarea statusului comenzii."
      );
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    try {
      clearFeedback();
      await updatePaymentStatusAdmin(orderId, paymentStatus);
      setMessage("Statusul plății a fost actualizat.");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          "Eroare la actualizarea statusului plății."
      );
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchProduct.toLowerCase())
    );
  }, [products, searchProduct]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesOrderStatus =
        orderStatusFilter === "all" || order.orderStatus === orderStatusFilter;

      const matchesPaymentStatus =
        paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;

      return matchesOrderStatus && matchesPaymentStatus;
    });
  }, [orders, orderStatusFilter, paymentStatusFilter]);

  return (
    <section className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-[2.5rem] bg-[#5B2E2E] p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E7C9A9]">
            Panou administrare
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Administrează produsele, stocurile și comenzile într-o interfață
            aliniată cu restul aplicației.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[2rem] bg-white p-4 shadow-sm">
            <p className="px-3 pb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Navigare admin
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-medium transition ${
                  activeTab === "products"
                    ? "bg-[#5B2E2E] text-white"
                    : "bg-[#F7F3EE] text-neutral-700 hover:bg-[#efe7dd]"
                }`}
              >
                <Package size={18} />
                Produse
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-medium transition ${
                  activeTab === "orders"
                    ? "bg-[#5B2E2E] text-white"
                    : "bg-[#F7F3EE] text-neutral-700 hover:bg-[#efe7dd]"
                }`}
              >
                <ShoppingCart size={18} />
                Comenzi
              </button>
            </div>
          </aside>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            {activeTab === "products" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#5B2E2E]">Gestionare produse</h2>
                    <p className="mt-2 text-neutral-600">
                      Adaugă produse noi, caută rapid și actualizează stocul.
                    </p>
                  </div>

                  <button
                    onClick={fetchProducts}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                  >
                    <RefreshCcw size={16} />
                    Reîncarcă
                  </button>
                </div>

                <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[2rem] bg-[#F7F3EE] p-6">
                    <h3 className="text-xl font-bold text-[#5B2E2E]">Adaugă produs</h3>

                    <form onSubmit={handleCreate} className="mt-6 space-y-4">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nume produs"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                        required
                      />

                      <input
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        placeholder="slug-produs"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                        required
                      />

                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Descriere"
                        rows={4}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          type="number"
                          placeholder="Preț"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                          required
                        />
                        <input
                          name="stock"
                          value={form.stock}
                          onChange={handleChange}
                          type="number"
                          placeholder="Stoc"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                          required
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="Categorie"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                          required
                        />
                        <input
                          name="weight"
                          value={form.weight}
                          onChange={handleChange}
                          placeholder="Greutate ex: 1kg"
                          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                        />
                      </div>

                      <input
                        name="images"
                        value={form.images}
                        onChange={handleChange}
                        placeholder="URL imagine"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                      />

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-full bg-[#5B2E2E] py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                      >
                        {saving ? "Se salvează..." : "Adaugă produs"}
                      </button>
                    </form>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-xl font-bold text-[#5B2E2E]">Produse existente</h3>

                      <input
                        type="text"
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        placeholder="Caută după nume..."
                        className="w-full max-w-xs rounded-full border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
                      />
                    </div>

                    {loadingProducts ? (
                      <p className="mt-6 text-neutral-500">Se încarcă produsele...</p>
                    ) : filteredProducts.length === 0 ? (
                      <p className="mt-6 text-neutral-500">Nu există produse.</p>
                    ) : (
                      <div className="mt-6 space-y-4">
                        {filteredProducts.map((product) => {
                          const currentStock = Number(product.stock || 0);

                          return (
                            <div
                              key={product.id}
                              className="rounded-[1.75rem] border border-black/5 bg-[#F7F3EE] p-5"
                            >
                              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={product.images?.[0] || "https://dummyimage.com/100x100"}
                                    alt={product.name}
                                    className="h-20 w-20 rounded-2xl object-cover"
                                  />

                                  <div>
                                    <h4 className="font-semibold text-[#2B2B2B]">{product.name}</h4>
                                    <p className="text-sm text-neutral-500">
                                      {product.price} RON · {product.category}
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                      Disponibil: {product.isAvailable ? "Da" : "Nu"}
                                    </p>
                                    <p
                                      className={`mt-1 text-sm font-semibold ${
                                        currentStock === 0 ? "text-red-600" : "text-green-700"
                                      }`}
                                    >
                                      Stoc: {currentStock}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                  <Trash2 size={16} />
                                  Șterge
                                </button>
                              </div>

                              <div className="mt-5 grid gap-3 md:grid-cols-[140px_1fr_1fr]">
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="Cantitate"
                                  value={stockInputs[product.id]?.amount ?? ""}
                                  onChange={(e) =>
                                    handleStockInputChange(product.id, "amount", e.target.value)
                                  }
                                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                                />
                                <button
                                  onClick={() => handleAddStock(product)}
                                  className="rounded-full bg-green-600 px-4 py-3 font-semibold text-white"
                                >
                                  + Adaugă stoc
                                </button>
                                <button
                                  onClick={() => handleSubtractStock(product)}
                                  className="rounded-full bg-orange-500 px-4 py-3 font-semibold text-white"
                                >
                                  - Scade stoc
                                </button>
                              </div>

                              <div className="mt-3 grid gap-3 md:grid-cols-[140px_1fr]">
                                <input
                                  type="number"
                                  min="0"
                                  value={stockInputs[product.id]?.directStock ?? 0}
                                  onChange={(e) =>
                                    handleStockInputChange(product.id, "directStock", e.target.value)
                                  }
                                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                                />
                                <button
                                  onClick={() => handleSetExactStock(product)}
                                  className="rounded-full bg-[#5B2E2E] px-4 py-3 font-semibold text-white"
                                >
                                  Setează stoc exact
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#5B2E2E]">Gestionare comenzi</h2>
                    <p className="mt-2 text-neutral-600">
                      Vezi toate comenzile și actualizează statusurile lor.
                    </p>
                  </div>

                  <button
                    onClick={fetchOrders}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                  >
                    <RefreshCcw size={16} />
                    Reîncarcă
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-600">
                      Filtru status comandă
                    </label>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
                    >
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status === "all" ? "Toate" : status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-600">
                      Filtru status plată
                    </label>
                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status === "all" ? "Toate" : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {loadingOrders ? (
                  <p className="mt-6 text-neutral-500">Se încarcă comenzile...</p>
                ) : filteredOrders.length === 0 ? (
                  <p className="mt-6 text-neutral-500">Nu există comenzi.</p>
                ) : (
                  <div className="mt-6 space-y-6">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[1.75rem] border border-black/5 bg-[#F7F3EE] p-6"
                      >
                        <div className="flex flex-wrap justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#2B2B2B]">
                              {order.orderNumber || `Comandă ${order.id}`}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : "-"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-[#5B2E2E]">
                              {order.total} RON
                            </p>
                            <p className="text-sm text-neutral-500">
                              {order.paymentStatus} / {order.orderStatus}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-neutral-600">
                          <p><span className="font-medium">Client:</span> {order.customer?.name}</p>
                          <p><span className="font-medium">Email:</span> {order.customer?.email}</p>
                          <p><span className="font-medium">Telefon:</span> {order.customer?.phone}</p>
                          <p><span className="font-medium">Adresă:</span> {order.customer?.address}</p>
                        </div>

                        <div className="mt-5 rounded-2xl bg-white p-4">
                          <p className="mb-3 font-semibold text-[#2B2B2B]">Produse comandate</p>
                          <div className="space-y-3">
                            {order.items?.map((item, index) => (
                              <div
                                key={index}
                                className="flex flex-wrap justify-between gap-3 text-sm text-neutral-700"
                              >
                                <div>
                                  <span className="font-medium">
                                    {item.name} x {item.quantity}
                                  </span>

                                  {item.custom && item.configuration && (
                                    <p className="mt-1 text-xs text-neutral-500">
                                      {item.configuration.blat} · {item.configuration.crema} ·{" "}
                                      {item.configuration.decor} · {item.configuration.weight}kg
                                    </p>
                                  )}
                                </div>

                                <span>{item.price * item.quantity} RON</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-600">
                              Status comandă
                            </label>
                            <select
                              value={order.orderStatus || "pending"}
                              onChange={(e) =>
                                handleOrderStatusChange(order.id, e.target.value)
                              }
                              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                            >
                              {ORDER_STATUS_OPTIONS.filter((s) => s !== "all").map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-600">
                              Status plată
                            </label>
                            <select
                              value={order.paymentStatus || "pending"}
                              onChange={(e) =>
                                handlePaymentStatusChange(order.id, e.target.value)
                              }
                              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                            >
                              {PAYMENT_STATUS_OPTIONS.filter((s) => s !== "all").map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}