import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { getSessionId } from "../utils/session";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
        setMessage("Produsul nu a putut fi încărcat.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      setMessage("");

      const sessionId = getSessionId();

      const res = await addToCart({
        sessionId,
        productId: product.id,
        quantity,
      });

      setMessage(res.message || "Produs adăugat în coș.");
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message || "A apărut o eroare la adăugare."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-neutral-500">Se încarcă produsul...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-neutral-500">Produs inexistent.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-[#5B2E2E]"
      >
        <ArrowLeft size={16} />
        Înapoi la produse
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
        >
          <div className="aspect-square bg-neutral-100">
            <img
              src={product.images?.[0] || "https://dummyimage.com/700x700"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[2rem] bg-white p-8 shadow-sm"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#A67C52]">
            Atelier premium
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#2B2B2B]">
            {product.name}
          </h1>

          <p className="mt-4 text-base leading-7 text-neutral-600">
            {product.description || "Tort artizanal pregătit cu ingrediente atent alese."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {product.category && (
              <span className="rounded-full bg-[#F7F3EE] px-4 py-2 text-sm text-neutral-700">
                {product.category}
              </span>
            )}
            {product.weight && (
              <span className="rounded-full bg-[#F7F3EE] px-4 py-2 text-sm text-neutral-700">
                {product.weight}
              </span>
            )}
            <span className="rounded-full bg-[#F7F3EE] px-4 py-2 text-sm text-neutral-700">
              Stoc: {product.stock}
            </span>
          </div>

          <div className="mt-8 text-3xl font-bold text-[#5B2E2E]">
            {product.price} RON
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-black/10 bg-[#F7F3EE]">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-3 text-lg"
              >
                -
              </button>

              <span className="min-w-10 text-center font-semibold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    product.stock ? Math.min(product.stock, prev + 1) : prev + 1
                  )
                }
                className="px-4 py-3 text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || !product.isAvailable}
              className="inline-flex items-center gap-2 rounded-full bg-[#5B2E2E] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingBag size={18} />
              {adding ? "Se adaugă..." : "Adaugă în coș"}
            </button>
          </div>

          {message && (
            <p className="mt-4 text-sm text-neutral-600">{message}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}