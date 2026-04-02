import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/mutations/useAuthMutations";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

const navLinkClass = (active) =>
  `text-sm font-medium transition-colors ${
    active ? "text-[var(--ss-brand)]" : "text-[var(--ss-muted)] hover:text-[var(--ss-brand)]"
  }`;

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const logoutMutation = useLogout();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgb(255_255_255_/_0.1)] bg-[rgb(9_11_18_/_0.75)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-black tracking-tight text-[var(--ss-brand)]">
            Snap<span className="text-white">Sell</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className={navLinkClass(location.pathname.startsWith("/products"))}>
              Browse
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className={navLinkClass(
                    user.role === "admin"
                      ? location.pathname.startsWith("/admin")
                      : location.pathname.startsWith("/dashboard")
                  )}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage?.url}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-[rgb(255_255_255_/_0.15)]"
                  />
                  <button onClick={() => logoutMutation.mutate()} className="ss-btn-ghost text-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass(location.pathname === "/login")}>
                  Login
                </Link>
                <Link to="/register" className="ss-btn-primary !py-2 !px-4 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden ss-btn-ghost" onClick={() => setOpen(!open)}>
            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <div className="ss-panel !p-3 space-y-1">
              <Link to="/products" className="block px-3 py-2 rounded-lg ss-muted hover:text-[var(--ss-brand)]" onClick={() => setOpen(false)}>
                Browse
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="block px-3 py-2 rounded-lg ss-muted hover:text-[var(--ss-brand)]"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logoutMutation.mutate();
                      setOpen(false);
                    }}
                    className="w-full justify-start ss-btn-danger !py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-lg ss-muted" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="block ss-btn-primary text-center" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
