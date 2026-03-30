import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);
  //     setMessage("");

  //     const res = await register(form);

  //     localStorage.setItem("token", res.token);
  //     await loadUser();

  //     navigate("/");
  //   } catch (error) {
  //     setMessage(error?.response?.data?.message || "Eroare la înregistrare");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setMessage("");

    const res = await register(form);

    localStorage.setItem("token", res.token);

    const currentUser = await loadUser();

    if (currentUser?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    setMessage(error?.response?.data?.message || "Eroare la înregistrare");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <button
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-[#5B2E2E]"
      >
        <ArrowLeft size={16} />
        Înapoi
      </button>

      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#5B2E2E]">Creează cont</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Fă-ți cont pentru a comanda mai rapid și pentru a vedea istoricul comenzilor.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Nume"
            onChange={handleChange}
            value={form.name}
            className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Parolă"
            onChange={handleChange}
            value={form.password}
            className="w-full rounded-2xl border border-black/10 bg-[#F7F3EE] px-4 py-3 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#5B2E2E] py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Se procesează..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-red-600">{message}</p>
        )}

        <p className="mt-6 text-sm text-neutral-600">
          Ai deja cont?{" "}
          <Link to="/login" className="font-semibold text-[#5B2E2E] hover:underline">
            Autentifică-te aici
          </Link>
        </p>
      </div>
    </section>
  );
}