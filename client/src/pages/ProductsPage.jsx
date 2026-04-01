import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../hooks/queries/useProducts";
import { useCategories } from "../hooks/queries/useCategories";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { HiSearch } from "react-icons/hi";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const params = {
    page: searchParams.get("page") || 1,
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "-createdAt",
    limit: 12,
  };

  const { data, isLoading } = useProducts(params);
  const { data: categories } = useCategories();

  const updateParams = (updates) => {
    const newParams = { ...Object.fromEntries(searchParams), ...updates };
    Object.keys(newParams).forEach((k) => {
      if (!newParams[k]) delete newParams[k];
    });
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Search
          </button>
        </form>
        <select
          value={params.sort}
          onChange={(e) => updateParams({ sort: e.target.value, page: "" })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>

      {/* Category filter */}
      {categories?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => updateParams({ category: "", page: "" })}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              !params.category
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParams({ category: cat.slug, page: "" })}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                params.category === cat.slug
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : !data?.products?.length ? (
        <EmptyState title="No products found" />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination
            pagination={data.pagination}
            onPageChange={(page) => updateParams({ page })}
          />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
