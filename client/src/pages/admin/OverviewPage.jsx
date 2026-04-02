import { Link } from "react-router-dom";
import { useAdminSellers, useAdminProducts } from "../../hooks/queries/useAdmin";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiUserGroup, HiCollection, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";

const StatCard = ({ label, value, icon: Icon, color, to }) => (
  <Link to={to} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Link>
);

const AdminOverviewPage = () => {
  const { data: sellers, isLoading: sellersLoading } = useAdminSellers();
  const { data: productsData, isLoading: productsLoading } = useAdminProducts();

  if (sellersLoading || productsLoading) return <LoadingSpinner />;

  const activeSellers = sellers?.filter((s) => s.isActive).length || 0;
  const suspendedSellers = sellers?.filter((s) => !s.isActive).length || 0;
  const totalProducts = productsData?.pagination?.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Sellers"
          value={sellers?.length || 0}
          icon={HiUserGroup}
          color="bg-indigo-500"
          to="/admin/sellers"
        />
        <StatCard
          label="Active Sellers"
          value={activeSellers}
          icon={HiCheckCircle}
          color="bg-green-500"
          to="/admin/sellers"
        />
        <StatCard
          label="Suspended Sellers"
          value={suspendedSellers}
          icon={HiExclamationCircle}
          color="bg-red-500"
          to="/admin/sellers"
        />
        <StatCard
          label="Total Products"
          value={totalProducts}
          icon={HiCollection}
          color="bg-blue-500"
          to="/admin/products"
        />
      </div>
    </div>
  );
};

export default AdminOverviewPage;
