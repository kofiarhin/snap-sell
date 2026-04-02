import { useParams, Link } from "react-router-dom";
import { useSellerPublicProducts } from "../hooks/queries/useProducts";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const SellerPage = () => {
  const { sellerId } = useParams();
  const { data: products, isLoading, isError } = useSellerPublicProducts(sellerId);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Seller not found</h2>
        <p className="mt-2 text-gray-500">This seller doesn't exist or has been removed.</p>
        <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          Browse all products
        </Link>
      </div>
    );
  }

  const seller = products?.[0]?.seller;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Seller Info */}
      {seller && (
        <div className="flex items-center gap-4 mb-8">
          {seller.profileImage?.url && (
            <img
              src={seller.profileImage.url}
              alt={seller.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{seller.fullName}</h1>
            <p className="text-gray-500">
              {products?.length || 0} {products?.length === 1 ? "listing" : "listings"}
            </p>
          </div>
        </div>
      )}

      {!seller && (
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Seller Listings</h1>
      )}

      {/* Products */}
      {!products?.length ? (
        <EmptyState message="This seller has no active listings." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerPage;
