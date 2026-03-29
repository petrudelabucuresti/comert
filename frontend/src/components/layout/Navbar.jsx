import { Link, NavLink } from "react-router-dom";
import { CakeSlice, ShoppingBag, User, WandSparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `transition-colors duration-200 ${
    isActive
      ? "text-[#5B2E2E] font-semibold"
      : "text-neutral-600 hover:text-[#5B2E2E]"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F7F3EE]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-2xl bg-[#5B2E2E] p-2 text-white shadow-md">
            <CakeSlice size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Atelier de Torturi
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}

          <NavLink to="/" className={navLinkClass}>
            Acasă
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Produse
          </NavLink>
          <NavLink to="/custom-cake" className={navLinkClass}>
            Tort personalizat
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            Comenzile mele
          </NavLink>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-neutral-600 md:inline">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              Logout
            </button>
            <Link
              to="/cart"
              className="rounded-full bg-[#5B2E2E] p-2.5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <ShoppingBag size={18} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-black/10 bg-white p-2.5 text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <User size={18} />
            </Link>
            <Link
              to="/custom-cake"
              className="hidden rounded-full bg-[#A67C52] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow md:inline-flex"
            >
              <WandSparkles size={16} className="mr-2" />
              Configurează
            </Link>
            <Link
              to="/cart"
              className="rounded-full bg-[#5B2E2E] p-2.5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <ShoppingBag size={18} />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}