import { useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [params] = useSearchParams();
  const order = params.get("order");

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Plata reușită 🎉
        </h1>

        <p className="mt-4 text-neutral-600">
          Comanda ta a fost înregistrată.
        </p>

        <p className="mt-2 font-semibold">
          Număr comandă: {order}
        </p>
      </div>
    </section>
  );
}