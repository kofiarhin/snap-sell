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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0">
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
