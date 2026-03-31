import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WandSparkles, ShoppingBag } from "lucide-react";
import { addCustomCakeToCart } from "../services/customCakeService";
import { getSessionId } from "../utils/session";

const options = {
  blaturi: [
    { value: "ciocolata", label: "Blat de ciocolată", multiplier: 1.08 },
    { value: "vanilie", label: "Blat de vanilie", multiplier: 1 },
    { value: "red_velvet", label: "Blat Red Velvet", multiplier: 1.12 },
    { value: "fistic", label: "Blat cu fistic", multiplier: 1.2 },
    { value: "gluten_free", label: "Blat fără gluten", multiplier: 1.15 },
    { value: "vegan", label: "Blat vegan", multiplier: 1.1 },
  ],
  creme: [
    { value: "oreo", label: "Cremă Oreo", multiplier: 1.08 },
    { value: "mascarpone", label: "Cremă Mascarpone", multiplier: 1.1 },
    { value: "branza_fina", label: "Cremă fină de brânză", multiplier: 1.12 },
    { value: "ciocolata_belgiana", label: "Cremă de ciocolată belgiană", multiplier: 1.18 },
    { value: "fructe_padure", label: "Cremă cu fructe de pădure", multiplier: 1.1 },
    { value: "zmeura", label: "Cremă de zmeură", multiplier: 1.14 },
    { value: "mousse_ciocolata", label: "Mousse de ciocolată", multiplier: 1.16 },
    { value: "vanilie", label: "Cremă de vanilie", multiplier: 1 },
  ],
  decor: [
    { value: "fructe", label: "Decor cu fructe", multiplier: 1.08 },
    { value: "fondant", label: "Decor fondant", multiplier: 1.15 },
    { value: "premium", label: "Decor premium", multiplier: 1.22 },
    { value: "floral", label: "Decor floral", multiplier: 1.25 },
    { value: "copii", label: "Decor tematic copii", multiplier: 1.2 },
    { value: "elegant", label: "Decor elegant", multiplier: 1.18 },
    { value: "supereroi", label: "Decor supereroi", multiplier: 1.24 },
    { value: "unicorn", label: "Decor unicorn", multiplier: 1.26 },
  ],
  dietary: [
    { value: "standard", label: "Standard", multiplier: 1 },
    { value: "vegan", label: "Vegan", multiplier: 1.12 },
    { value: "sugar_free", label: "Fără zahăr", multiplier: 1.1 },
    { value: "gluten_free", label: "Fără gluten", multiplier: 1.15 },
  ],
  occasion: [
    { value: "aniversare", label: "Aniversare", multiplier: 1 },
    { value: "copii", label: "Petrecere copii", multiplier: 1.08 },
    { value: "nunta", label: "Nuntă", multiplier: 1.22 },
    { value: "eveniment", label: "Eveniment special", multiplier: 1.1 },
  ],
  shape: [
    { value: "rotund", label: "Rotund", multiplier: 1 },
    { value: "patrat", label: "Pătrat", multiplier: 1.04 },
    { value: "etajat", label: "Etajat", multiplier: 1.2 },
  ],
};

const weightOptions = [
  { value: 1, label: "1 kg" },
  { value: 1.5, label: "1.5 kg" },
  { value: 2, label: "2 kg" },
  { value: 2.5, label: "2.5 kg" },
  { value: 3, label: "3 kg" },
  { value: 4, label: "4 kg" },
];

/**
 * Bază de preț derivată din produsele existente:
 * - Red Velvet: 150 / 1.2kg = 125 RON/kg
 * - Ciocolată Deluxe: 180 / 1.4kg ≈ 128.57 RON/kg
 * - Unicorn: 200 / 1.5kg ≈ 133.33 RON/kg
 * - Spiderman: 220 / 1.6kg = 137.5 RON/kg
 * - Nuntă Elegant: 500 / 3kg ≈ 166.67 RON/kg
 * - Nuntă Luxury: 750 / 4kg = 187.5 RON/kg
 * - Vegan Berry: 170 / 1.2kg ≈ 141.67 RON/kg
 * - Fără Zahăr: 165 / 1.1kg = 150 RON/kg
 * - Gluten Free: 190 / 1.3kg ≈ 146.15 RON/kg
 *
 * Alegem un base fair pentru tort personalizat standard: 125 RON/kg
 * și aplicăm multiplicatori pe componente.
 */
const BASE_PRICE_PER_KG = 125;

const getOptionMeta = (collection, value) =>
  collection.find((item) => item.value === value) || collection[0];

const getOptionLabel = (collection, value) =>
  getOptionMeta(collection, value)?.label || value;

const roundTo5 = (value) => Math.round(value / 5) * 5;

const estimateCustomCakePrice = (form) => {
  const blat = getOptionMeta(options.blaturi, form.blat);
  const crema = getOptionMeta(options.creme, form.crema);
  const decor = getOptionMeta(options.decor, form.decor);
  const dietary = getOptionMeta(options.dietary, form.dietary);
  const occasion = getOptionMeta(options.occasion, form.occasion);
  const shape = getOptionMeta(options.shape, form.shape);

  let total =
    BASE_PRICE_PER_KG *
    form.weight *
    blat.multiplier *
    crema.multiplier *
    decor.multiplier *
    dietary.multiplier *
    occasion.multiplier *
    shape.multiplier;

  if (form.extraMessage) total += 15;
  if (form.topper) total += 25;

  return roundTo5(total);
};

export default function CustomCakePage() {
  const [form, setForm] = useState({
    blat: "vanilie",
    crema: "mascarpone",
    decor: "fructe",
    dietary: "standard",
    occasion: "aniversare",
    shape: "rotund",
    weight: 1,
    topper: false,
    extraMessage: false,
    message: "",
  });

  const [price, setPrice] = useState(0);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState("");

  const previewTitle = useMemo(() => {
    return `Tort personalizat ${form.weight}kg`;
  }, [form.weight]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "weight"
          ? Number(value)
          : value,
    }));
  };

  useEffect(() => {
    const calculated = estimateCustomCakePrice(form);
    setPrice(calculated);
  }, [
    form.blat,
    form.crema,
    form.decor,
    form.dietary,
    form.occasion,
    form.shape,
    form.weight,
    form.topper,
    form.extraMessage,
  ]);

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
        dietary: form.dietary,
        occasion: form.occasion,
        shape: form.shape,
        weight: form.weight,
        topper: form.topper,
        extraMessage: form.extraMessage,
        estimatedPrice: price,
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
          Am adăugat mai multe combinații inspirate din produsele existente:
          Red Velvet, ciocolată deluxe, variante premium, nuntă, copii,
          vegan, fără gluten și fără zahăr.
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
                Regim alimentar
              </label>
              <select
                name="dietary"
                value={form.dietary}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                {options.dietary.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
                Ocazie
              </label>
              <select
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                {options.occasion.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2B2B2B]">
                Formă
              </label>
              <select
                name="shape"
                value={form.shape}
                onChange={handleChange}
                className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
              >
                {options.shape.map((item) => (
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
                {weightOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl bg-[#F7F3EE] px-4 py-3">
              <input
                type="checkbox"
                name="topper"
                checked={form.topper}
                onChange={handleChange}
              />
              <span className="text-sm font-medium text-[#2B2B2B]">
                Topper decorativ (+25 RON)
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-[#F7F3EE] px-4 py-3">
              <input
                type="checkbox"
                name="extraMessage"
                checked={form.extraMessage}
                onChange={handleChange}
              />
              <span className="text-sm font-medium text-[#2B2B2B]">
                Mesaj personalizat (+15 RON)
              </span>
            </label>
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
                <span className="font-medium text-[#2B2B2B]">
                  {getOptionLabel(options.blaturi, form.blat)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Cremă</span>
                <span className="font-medium text-[#2B2B2B]">
                  {getOptionLabel(options.creme, form.crema)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Decor</span>
                <span className="font-medium text-[#2B2B2B]">
                  {getOptionLabel(options.decor, form.decor)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Regim</span>
                <span className="font-medium text-[#2B2B2B]">
                  {getOptionLabel(options.dietary, form.dietary)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Ocazie</span>
                <span className="font-medium text-[#2B2B2B]">
                  {getOptionLabel(options.occasion, form.occasion)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Formă</span>
                <span className="font-medium text-[#2B2B2B]">
                  {getOptionLabel(options.shape, form.shape)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Greutate</span>
                <span className="font-medium text-[#2B2B2B]">
                  {form.weight} kg
                </span>
              </div>

              {form.topper && (
                <div className="flex justify-between gap-4">
                  <span>Topper</span>
                  <span className="font-medium text-[#2B2B2B]">Da</span>
                </div>
              )}

              {form.extraMessage && (
                <div className="flex justify-between gap-4">
                  <span>Mesaj personalizat</span>
                  <span className="font-medium text-[#2B2B2B]">Da</span>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-black/8 pt-5">
              <p className="text-sm text-neutral-500">Preț estimat</p>
              <div className="mt-2 text-3xl font-bold text-[#5B2E2E]">
                {price} RON
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