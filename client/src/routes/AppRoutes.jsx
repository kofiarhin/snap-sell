import { Routes, Route } from "react-router-dom";

import PublicLayout from "../components/PublicLayout";
import GuestRoute from "../components/GuestRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

// Public pages
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CategoryPage from "../pages/CategoryPage";
import SellerPage from "../pages/SellerPage";
import NotFoundPage from "../pages/NotFoundPage";

// Guest-only pages
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// Seller dashboard pages
import OverviewPage from "../pages/dashboard/OverviewPage";
import MyListingsPage from "../pages/dashboard/MyListingsPage";
import CreateListingPage from "../pages/dashboard/CreateListingPage";
import EditListingPage from "../pages/dashboard/EditListingPage";
import SoldItemsPage from "../pages/dashboard/SoldItemsPage";
import ArchivedPage from "../pages/dashboard/ArchivedPage";
import InquiriesPage from "../pages/dashboard/InquiriesPage";
import InquiryDetailPage from "../pages/dashboard/InquiryDetailPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import PasswordPage from "../pages/dashboard/PasswordPage";

// Admin pages
import AdminOverviewPage from "../pages/admin/OverviewPage";
import AdminSellersPage from "../pages/admin/SellersPage";
import AdminSellerDetailPage from "../pages/admin/SellerDetailPage";
import AdminProductsPage from "../pages/admin/ProductsPage";
import AdminProductDetailPage from "../pages/admin/ProductDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="seller/:sellerId" element={<SellerPage />} />

        {/* Guest-only routes */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Seller dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route element={<PublicLayout />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="listings" element={<MyListingsPage />} />
            <Route path="listings/new" element={<CreateListingPage />} />
            <Route path="listings/:id/edit" element={<EditListingPage />} />
            <Route path="sold" element={<SoldItemsPage />} />
            <Route path="archived" element={<ArchivedPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="inquiries/:id" element={<InquiryDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="password" element={<PasswordPage />} />
          </Route>
        </Route>
      </Route>

      {/* Admin dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<PublicLayout />}>
          <Route path="admin" element={<DashboardLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="sellers" element={<AdminSellersPage />} />
            <Route path="sellers/:id" element={<AdminSellerDetailPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/:id" element={<AdminProductDetailPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
