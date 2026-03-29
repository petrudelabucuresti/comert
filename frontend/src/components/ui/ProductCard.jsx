import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm"
    >
      <Link to={`/products/${product.id}`}>
        <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
          <img
            src={product.images?.[0] || "https://dummyimage.com/600x700"}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-[#2B2B2B]">
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
            {product.description || "Tort premium pentru evenimente speciale."}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xl font-bold text-[#5B2E2E]">
              {product.price} RON
            </span>
            <span className="text-sm font-medium text-neutral-400 transition group-hover:text-[#5B2E2E]">
              Detalii →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}