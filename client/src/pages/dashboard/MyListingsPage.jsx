import { Link } from "react-router-dom";
import { useMyProducts } from "../../hooks/queries/useProducts";
import {
  useDeleteProduct,
  useMarkSold,
  useArchiveProduct,
  useReactivateProduct,
} from "../../hooks/mutations/useProductMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

import { getStatusBadgeClass } from "../../utils/ui";

const MyListingsPage = () => {
  const { data: products, isLoading } = useMyProducts();
  const deleteMutation = useDeleteProduct();
  const soldMutation = useMarkSold();
  const archiveMutation = useArchiveProduct();
  const reactivateMutation = useReactivateProduct();

  if (isLoading) return <LoadingSpinner />;

  const activeProducts = products?.filter((p) => p.status === "active") || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          to="/dashboard/listings/new"
          className="ss-btn-primary"
        >
          + Add Product
        </Link>
      </div>

      {!activeProducts.length ? (
        <EmptyState
          title="No active listings"
          message="Create your first product listing"
          action={
            <Link to="/dashboard/listings/new" className="text-[var(--ss-brand)] hover:underline">
              Add Product
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {activeProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 ss-card"
            >
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{product.title}</h3>
                <p className="text-sm ss-muted">
                  ${product.price?.toFixed(2)} &middot; Qty: {product.quantity}
                </p>
              </div>
              <span className={getStatusBadgeClass(product.status)}>
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
                      className="text-sm text-emerald-300 hover:underline"
                    >
                      Sold
                    </button>
                    <button
                      onClick={() => archiveMutation.mutate(product._id)}
                      className="text-sm ss-muted hover:underline"
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
    </div>
  );
};

export default MyListingsPage;
