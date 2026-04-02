import { createElement } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiHome,
  HiCollection,
  HiPlusCircle,
  HiChatAlt2,
  HiCog,
  HiLockClosed,
  HiArchive,
  HiCheckCircle,
} from "react-icons/hi";

const sellerLinks = [
  { to: "/dashboard", label: "Overview", icon: HiHome },
  { to: "/dashboard/listings", label: "My Listings", icon: HiCollection },
  { to: "/dashboard/listings/new", label: "Add Product", icon: HiPlusCircle },
  { to: "/dashboard/sold", label: "Sold Items", icon: HiCheckCircle },
  { to: "/dashboard/archived", label: "Archived", icon: HiArchive },
  { to: "/dashboard/inquiries", label: "Inquiries", icon: HiChatAlt2 },
  { to: "/dashboard/profile", label: "Profile", icon: HiCog },
  { to: "/dashboard/password", label: "Password", icon: HiLockClosed },
];

const adminLinks = [
  { to: "/admin", label: "Overview", icon: HiHome },
  { to: "/admin/sellers", label: "Sellers", icon: HiCollection },
  { to: "/admin/products", label: "Products", icon: HiArchive },
];

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const links = user?.role === "admin" ? adminLinks : sellerLinks;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <aside>
          <div className="sticky top-24 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="px-3 pb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Workspace</p>
            <nav className="space-y-1.5">
              {links.map(({ to, label, icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                        : "border border-transparent text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/60"
                    }`}
                  >
                    {createElement(icon, { className: "h-5 w-5" })}
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
