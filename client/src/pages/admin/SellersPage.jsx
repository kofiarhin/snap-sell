import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminSellers } from "../../hooks/queries/useAdmin";
import { useSuspendSeller, useActivateSeller } from "../../hooks/mutations/useAdminMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const AdminSellersPage = () => {
  const { data: sellers, isLoading } = useAdminSellers();
  const suspendMutation = useSuspendSeller();
  const activateMutation = useActivateSeller();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (isLoading) return <LoadingSpinner />;

  const filtered = (sellers || []).filter((seller) => {
    const matchesSearch =
      seller.fullName.toLowerCase().includes(search.toLowerCase()) ||
      seller.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && seller.isActive) ||
      (statusFilter === "suspended" && !seller.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Sellers</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState message="No sellers found." />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Seller</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {seller.profileImage?.url ? (
                          <img
                            src={seller.profileImage.url}
                            alt={seller.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200" />
                        )}
                        <Link
                          to={`/admin/sellers/${seller._id}`}
                          className="font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {seller.fullName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{seller.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          seller.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {seller.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {seller.isActive ? (
                        <button
                          onClick={() => suspendMutation.mutate(seller._id)}
                          disabled={suspendMutation.isPending}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => activateMutation.mutate(seller._id)}
                          disabled={activateMutation.isPending}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellersPage;
