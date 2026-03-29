import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WandSparkles, ShoppingBag } from "lucide-react";
import {
  calculateCustomCake,
  addCustomCakeToCart,
} from "../services/customCakeService";
import { getSessionId } from "../utils/session";

const options = {
  blaturi: [
    { value: "ciocolata", label: "Blat de ciocolată" },
    { value: "vanilie", label: "Blat de vanilie" },
  ],
  creme: [
    { value: "oreo", label: "Cremă Oreo" },
    { value: "mascarpone", label: "Cremă Mascarpone" },
  ],
  decor: [
    { value: "fructe", label: "Decor cu fructe" },
    { value: "fondant", label: "Decor fondant" },
  ],
};

export default function CustomCakePage() {
  const [form, setForm] = useState({
    blat: "ciocolata",
    crema: "oreo",
    decor: "fructe",
    weight: 1,
    message: "",
  });

  const [price, setPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState("");

  const previewTitle = useMemo(() => {
    return `Tort personalizat ${form.weight}kg`;
  }, [form.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "weight" ? Number(value) : value,
    }));
  };

  const fetchPrice = async () => {
    try {
      setLoadingPrice(true);
      const res = await calculateCustomCake({
        blat: form.blat,
        crema: form.crema,
        decor: form.decor,
        weight: form.weight,
      });

      setPrice(res.data.price);
    } catch (error) {
      console.error(error);
      setFeedback("Nu am putut calcula prețul.");
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, [form.blat, form.crema, form.decor, form.weight]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      setFeedback("");

      const sessionId = getSessionId();

      const res = await addCustomCakeToCart({
        sessionId,
        blat: form.blat,
        crema: form.crema,
        decor: form.decor,
        weight: form.weight,
        message: form.message,
      });

      setFeedback(res.message || "Tortul personalizat a fost adăugat în coș.");
    } catch (error) {
      console.error(error);
      setFeedback(
        error?.response?.data?.message ||
          "A apărut o eroare la adăugarea în coș."
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A67C52]">
          Configurator
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#2B2B2B] md:text-5xl">
          Creează tortul exact cum îl vrei
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Alege compoziția, greutatea și mesajul, iar noi calculăm automat
          prețul și îl adăugăm în coș.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] bg-white p-8 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
                Alege blatul
              </label>
              <select
                name="blat"
                value={form.blat}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                {options.blaturi.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
                Alege crema
              </label>
              <select
                name="crema"
                value={form.crema}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                {options.creme.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
                Alege decorul
              </label>
              <select
                name="decor"
                value={form.decor}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                {options.decor.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
                Greutate
              </label>
              <select
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                <option value={1}>1 kg</option>
                <option value={2}>2 kg</option>
                <option value={3}>3 kg</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
              Mesaj pe tort
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Ex: La mulți ani, Andrei!"
              className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[2rem] bg-white p-8 shadow-sm"
        >
          <div className="rounded-[1.75rem] bg-[#F7F3EE] p-5">
            <div className="flex items-center gap-3 text-[#5B2E2E]">
              <WandSparkles size={20} />
              <p className="font-semibold">Previzualizare comandă</p>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[#2B2B2B]">
              {previewTitle}
            </h2>

            <div className="mt-5 space-y-3 text-sm text-neutral-600">
              <div className="flex justify-between gap-4">
                <span>Blat</span>
                <span className="font-medium text-[#2B2B2B] capitalize">
                  {form.blat}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Cremă</span>
                <span className="font-medium text-[#2B2B2B] capitalize">
                  {form.crema}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Decor</span>
                <span className="font-medium text-[#2B2B2B] capitalize">
                  {form.decor}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Greutate</span>
                <span className="font-medium text-[#2B2B2B]">
                  {form.weight} kg
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-black/8 pt-5">
              <p className="text-sm text-neutral-500">Preț estimat</p>
              <div className="mt-2 text-3xl font-bold text-[#5B2E2E]">
                {loadingPrice ? "Se calculează..." : `${price ?? 0} RON`}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5B2E2E] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingBag size={18} />
            {adding ? "Se adaugă..." : "Adaugă în coș"}
          </button>

          {feedback && (
            <p className="mt-4 text-sm text-neutral-600">{feedback}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}