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
import { getDashboardNavItemClass } from "../utils/ui";
import SettingsMenu from "./SettingsMenu";

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
    <div className="ss-page">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <div className="ss-panel sticky top-24 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide ss-muted">Settings</p>
              <SettingsMenu />
            </div>
            <nav className="space-y-1">
              {links.map(({ to, label, icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${getDashboardNavItemClass(isActive)}`}
                >
                  {createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </Link>
              );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
