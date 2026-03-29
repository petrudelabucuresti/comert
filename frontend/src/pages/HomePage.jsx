import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CakeSlice,
  Sparkles,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import FeatureCard from "../components/ui/FeatureCard";

const categories = [
  {
    title: "Torturi aniversare",
    text: "Modele elegante și moderne pentru aniversări, onomastici și petreceri speciale.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Torturi pentru copii",
    text: "Design-uri creative, culori armonioase și teme simpatice pentru cei mici.",
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Tort personalizat",
    text: "Alegi blat, cremă, decor și mesaj, iar noi îl transformăm într-un desert memorabil.",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A67C52]"
            >
              Atelier de torturi premium
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-4 text-5xl font-bold leading-tight tracking-tight text-[#2B2B2B] md:text-6xl"
            >
              Torturi create pentru momente care merită ținute minte
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-8 text-neutral-600"
            >
              Descoperă colecția noastră de torturi artizanale sau configurează
              unul personalizat, exact pe gustul tău.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#5B2E2E] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                Vezi produsele
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/custom-cake"
                className="rounded-full border border-black/10 bg-white px-6 py-3 font-semibold text-[#2B2B2B] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
              >
                Configurează tortul
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-600"
            >
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#A67C52]" />
                Ingrediente atent alese
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#A67C52]" />
                Design premium
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#A67C52]" />
                Comandă rapidă online
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -left-6 top-8 hidden rounded-3xl bg-white px-4 py-3 shadow-md md:block">
              <p className="text-sm font-semibold text-[#5B2E2E]">
                Tort personalizat
              </p>
              <p className="text-xs text-neutral-500">blat, cremă, decor, mesaj</p>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80"
                alt="Tort premium"
                className="h-[540px] w-full rounded-[2rem] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={CakeSlice}
            title="Rețete echilibrate"
            text="Gust bogat, textură fină și combinații potrivite pentru evenimente speciale sau cadouri rafinate."
          />
          <FeatureCard
            icon={Sparkles}
            title="Personalizare completă"
            text="Poți alege componentele tortului și poți adăuga un mesaj special direct din aplicație."
          />
          <FeatureCard
            icon={Truck}
            title="Flux simplu de comandă"
            text="Alegi produsul, completezi datele, plătești online și urmărești comanda într-un flux clar."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionTitle
          eyebrow="Colecții"
          title="Alege tipul de tort potrivit"
          subtitle="Fie că vrei un model elegant, festiv sau unul creat de la zero, ai un punct de pornire clar."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#2B2B2B]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionTitle
            eyebrow="De ce noi"
            title="Un proces simplu, dar cu rezultat premium"
            subtitle="Am gândit experiența astfel încât să fie ușor de comandat și plăcut de explorat."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] bg-[#F7F3EE] p-7">
              <div className="inline-flex rounded-2xl bg-white p-3 text-[#5B2E2E] shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Calitate constantă</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Produsele sunt pregătite cu accent pe gust, aspect și consistență.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#F7F3EE] p-7">
              <div className="inline-flex rounded-2xl bg-white p-3 text-[#5B2E2E] shadow-sm">
                <CakeSlice size={22} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Selecție variată</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Torturi aniversare, festive și opțiuni personalizabile pentru stiluri diferite.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[#F7F3EE] p-7">
              <div className="inline-flex rounded-2xl bg-white p-3 text-[#5B2E2E] shadow-sm">
                <Sparkles size={22} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Experiență modernă</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Interfață clară, coș de cumpărături, checkout online și configurator dedicat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="rounded-[2.5rem] bg-[#5B2E2E] px-8 py-12 text-white md:px-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E7C9A9]">
                Comandă acum
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Creează un tort care să se potrivească perfect evenimentului tău
              </h2>
              <p className="mt-4 max-w-xl text-white/80">
                Poți porni de la produsele existente sau poți merge direct în configurator.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link
                to="/products"
                className="rounded-full bg-white px-6 py-3 font-semibold text-[#5B2E2E] transition hover:-translate-y-0.5"
              >
                Vezi colecția
              </Link>
              <Link
                to="/custom-cake"
                className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Configurează tort
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}