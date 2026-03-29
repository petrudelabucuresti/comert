export default function SectionTitle({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A67C52]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#2B2B2B] md:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 max-w-2xl text-neutral-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}