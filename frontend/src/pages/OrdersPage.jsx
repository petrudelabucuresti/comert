import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!user) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Trebuie să fii logat
        </h1>
      </section>
    );
  }

  if (loading) return <p className="p-10">Se încarcă comenzile...</p>;

  if (orders.length === 0) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-2xl font-bold">
          Nu ai comenzi încă
        </h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold text-[#5B2E2E]">
        Comenzile mele
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            {/* HEADER */}
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-semibold">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {order.total} RON
                </p>
                <p className="text-sm">
                  {order.paymentStatus} / {order.orderStatus}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-4 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    {item.price * item.quantity} RON
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}