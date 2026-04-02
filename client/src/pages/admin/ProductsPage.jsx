import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminProducts } from "../../hooks/queries/useAdmin";
import { useAdminRemoveProduct } from "../../hooks/mutations/useAdminMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";

const AdminProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading } = useAdminProducts({ page, search: search || undefined, status: statusFilter || undefined });
  const removeMutation = useAdminRemoveProduct();

  if (isLoading) return <LoadingSpinner />;

  const { products, pagination } = data || {};

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      removeMutation.mutate(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Products</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {!products?.length ? (
        <EmptyState message="No products found." />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Seller</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url && (
                            <img src={product.images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                          )}
                          <Link
                            to={`/admin/products/${product._id}`}
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {product.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {product.seller ? (
                          <Link
                            to={`/admin/sellers/${product.seller._id}`}
                            className="text-gray-500 hover:text-indigo-600"
                          >
                            {product.seller.fullName}
                          </Link>
                        ) : (
                          <span className="text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.status === "active"
                              ? "bg-green-100 text-green-700"
                              : product.status === "sold"
                              ? "bg-blue-100 text-blue-700"
                              : product.status === "inactive"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{product.category?.label}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          disabled={removeMutation.isPending}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination?.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;
