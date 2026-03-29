export default function CancelPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Plata a fost anulată
        </h1>

        <p className="mt-4 text-neutral-600">
          Poți încerca din nou oricând.
        </p>
      </div>
    </section>
  );
}