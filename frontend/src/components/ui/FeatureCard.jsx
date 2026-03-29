import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-[1.75rem] bg-white p-6 shadow-sm"
    >
      <div className="inline-flex rounded-2xl bg-[#F7F3EE] p-3 text-[#5B2E2E]">
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-xl font-semibold text-[#2B2B2B]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </motion.div>
  );
}