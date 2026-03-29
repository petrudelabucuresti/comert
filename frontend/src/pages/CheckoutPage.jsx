import { useState } from "react";
import { createOrder } from "../services/orderService";
import { createCheckoutSession } from "../services/paymentService";
import { getSessionId } from "../utils/session";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const sessionId = getSessionId();

      // 1. Creează comandă
      const orderRes = await createOrder({
        sessionId,
        customer: form,
        paymentMethod: "card",
      });

      const orderId = orderRes.data.id;

      // 2. Creează Stripe session
      const paymentRes = await createCheckoutSession(orderId);

      // 3. Redirect
      window.location.href = paymentRes.data.url;

    } catch (err) {
      console.error(err);
      alert("Eroare la checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#5B2E2E]">
          Finalizare comandă
        </h1>

        <div className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Nume"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="phone"
            placeholder="Telefon"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

          <input
            name="address"
            placeholder="Adresă"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-8 w-full rounded-full bg-[#5B2E2E] py-3 text-white font-semibold"
        >
          {loading ? "Se procesează..." : "Plătește cu cardul"}
        </button>
      </div>
    </section>
  );
}