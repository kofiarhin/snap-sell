import { useParams, Link } from "react-router-dom";
import { useProducts } from "../hooks/queries/useProducts";
import { useCategories } from "../hooks/queries/useCategories";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { useState } from "react";

const CategoryPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useCategories();
  const { data, isLoading, isError } = useProducts({ category: slug, page });

  const categories = categoriesData || [];
  const category = categories.find((c) => c.slug === slug);

  if (isLoading) return <LoadingSpinner />;

  if (isError || (!isLoading && !category)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Category not found</h2>
        <p className="mt-2 text-gray-500">This category doesn't exist.</p>
        <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          Browse all products
        </Link>
      </div>
    );
  }

  const { products, pagination } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{category?.label}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{category?.label}</h1>

      {!products?.length ? (
        <EmptyState message="No products in this category yet." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination?.pages > 1 && (
            <div className="mt-8">
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

export default CategoryPage;
