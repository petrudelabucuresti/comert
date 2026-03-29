export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-bold text-[#5B2E2E]">Atelier de Torturi</h3>
            <p className="mt-2 max-w-md text-sm text-neutral-600">
              Torturi premium pentru aniversări, evenimente speciale și comenzi
              personalizate.
            </p>
          </div>

          <div className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Atelier de Torturi. Toate drepturile rezervate.
          </div>
        </div>
      </div>
    </footer>
  );
}