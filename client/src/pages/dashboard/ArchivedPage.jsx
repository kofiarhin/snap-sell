import { useMyProducts } from "../../hooks/queries/useProducts";
import { useReactivateProduct, useDeleteProduct } from "../../hooks/mutations/useProductMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const ArchivedPage = () => {
  const { data: products, isLoading } = useMyProducts();
  const reactivate = useReactivateProduct();
  const deleteMutation = useDeleteProduct();

  if (isLoading) return <LoadingSpinner />;

  const archived = products?.filter((p) => ["archived", "inactive"].includes(p.status)) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Archived Items</h1>

      {!archived.length ? (
        <EmptyState title="No archived items" />
      ) : (
        <div className="space-y-4">
          {archived.map((product) => (
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
                <p className="text-sm text-gray-500">${product.price?.toFixed(2)}</p>
              </div>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                {product.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => reactivate.mutate(product._id)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Reactivate
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete permanently?")) deleteMutation.mutate(product._id);
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

export default ArchivedPage;
