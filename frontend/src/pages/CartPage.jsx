import { useEffect, useState } from "react";
import { getCart, updateCart, removeFromCart } from "../services/cartService";
import { getSessionId } from "../utils/session";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = getSessionId();

  const fetchCart = async () => {
    try {
      const res = await getCart(sessionId);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const handleUpdate = async (productId, quantity) => {
    try {
      await updateCart({
        sessionId,
        productId,
        quantity,
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // REMOVE
  const handleRemove = async (productId) => {
    try {
      await removeFromCart({
        sessionId,
        productId,
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-10">Se încarcă coșul...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#5B2E2E]">
          Coșul este gol
        </h1>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-[#5B2E2E] px-6 py-3 text-white"
        >
          Vezi produse
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold text-[#5B2E2E]">
        Coșul tău
      </h1>

      <div className="grid gap-10 md:grid-cols-3">

        {/* LISTA PRODUSE */}
        <div className="md:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              <img
                src={item.image || "https://dummyimage.com/150"}
                alt={item.name}
                className="h-24 w-24 rounded-xl object-cover"
              />

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-neutral-500">
                    {item.price} RON
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdate(
                          item.productId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-3 py-1 border rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleUpdate(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="rounded-2xl bg-white p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold">Sumar comandă</h2>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{cart.subtotal} RON</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{cart.total} RON</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-full bg-[#5B2E2E] py-3 text-center text-white font-semibold"
          >
            Mergi la checkout
          </Link>
        </div>
      </div>
    </section>
  );
}