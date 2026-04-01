import { useMyProducts } from "../../hooks/queries/useProducts";
import { useSellerInquiries } from "../../hooks/queries/useInquiries";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiCollection, HiCheckCircle, HiChatAlt2, HiArchive } from "react-icons/hi";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const OverviewPage = () => {
  const { data: products, isLoading: loadingProducts } = useMyProducts();
  const { data: inquiries, isLoading: loadingInquiries } = useSellerInquiries();

  if (loadingProducts || loadingInquiries) return <LoadingSpinner />;

  const active = products?.filter((p) => p.status === "active").length || 0;
  const sold = products?.filter((p) => p.status === "sold").length || 0;
  const archived = products?.filter((p) => ["archived", "inactive"].includes(p.status)).length || 0;
  const newInquiries = inquiries?.filter((i) => i.status === "new").length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiCollection} label="Active Listings" value={active} color="bg-indigo-500" />
        <StatCard icon={HiCheckCircle} label="Sold" value={sold} color="bg-green-500" />
        <StatCard icon={HiArchive} label="Archived" value={archived} color="bg-gray-500" />
        <StatCard icon={HiChatAlt2} label="New Inquiries" value={newInquiries} color="bg-orange-500" />
      </div>
    </div>
  );
};

export default OverviewPage;
