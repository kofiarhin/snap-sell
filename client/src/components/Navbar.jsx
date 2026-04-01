import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/mutations/useAuthMutations";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const logoutMutation = useLogout();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            SnapSell
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-700 hover:text-indigo-600">
              Browse
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage?.url}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="text-gray-500 hover:text-red-600 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/products" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>
              Browse
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="block py-2 text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logoutMutation.mutate();
                    setOpen(false);
                  }}
                  className="block py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-indigo-600" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
