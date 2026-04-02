import { Link } from "react-router-dom";
import { useState } from "react";
import { useMyProducts } from "../../hooks/queries/useProducts";
import {
  useDeleteProduct,
  useMarkSold,
  useArchiveProduct,
  useReactivateProduct,
} from "../../hooks/mutations/useProductMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";

const statusBadge = {
  active: "bg-green-100 text-green-700",
  sold: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-700",
  inactive: "bg-yellow-100 text-yellow-700",
};

const MyListingsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyProducts({ page, limit: 8, status: "active" });
  const deleteMutation = useDeleteProduct();
  const soldMutation = useMarkSold();
  const archiveMutation = useArchiveProduct();
  const reactivateMutation = useReactivateProduct();

  if (isLoading) return <LoadingSpinner />;

  const activeProducts = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          to="/dashboard/listings/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Product
        </Link>
      </div>

      {!activeProducts.length ? (
        <EmptyState
          title="No active listings"
          message="Create your first product listing"
          action={
            <Link to="/dashboard/listings/new" className="text-indigo-600 hover:underline">
              Add Product
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {activeProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{product.title}</h3>
                <p className="text-sm text-gray-500">
                  ${product.price?.toFixed(2)} &middot; Qty: {product.quantity}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge[product.status]}`}>
                {product.status}
              </span>
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/listings/${product._id}/edit`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </Link>
                {product.status === "active" && (
                  <>
                    <button
                      onClick={() => soldMutation.mutate(product._id)}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Sold
                    </button>
                    <button
                      onClick={() => archiveMutation.mutate(product._id)}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Archive
                    </button>
                  </>
                )}
                {["archived", "inactive", "sold"].includes(product.status) && (
                  <button
                    onClick={() => reactivateMutation.mutate(product._id)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Reactivate
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Delete this product?")) deleteMutation.mutate(product._id);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default MyListingsPage;
