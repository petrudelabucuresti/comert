import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ui/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold text-[#5B2E2E] mb-10">
        Produsele noastre
      </h1>

      {loading ? (
        <p>Se încarcă...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}