import { useMyProducts } from "../../hooks/queries/useProducts";
import { useReactivateProduct } from "../../hooks/mutations/useProductMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const SoldItemsPage = () => {
  const { data, isLoading } = useMyProducts({ page: 1, limit: 100, status: "sold" });
  const reactivate = useReactivateProduct();

  if (isLoading) return <LoadingSpinner />;

  const sold = data?.products || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sold Items</h1>

      {!sold.length ? (
        <EmptyState title="No sold items yet" />
      ) : (
        <div className="space-y-4">
          {sold.map((product) => (
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
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                Sold
              </span>
              <button
                onClick={() => reactivate.mutate(product._id)}
                className="text-sm text-indigo-600 hover:underline"
              >
                Reactivate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoldItemsPage;
