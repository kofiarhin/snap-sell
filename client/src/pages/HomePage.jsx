import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/queries/useProducts";
import { useCategories } from "../hooks/queries/useCategories";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { HiSearch } from "react-icons/hi";

const HomePage = () => {
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
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find What You Need
          </h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse thousands of products from trusted sellers
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      {categories?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => updateParams({ category: "", page: "" })}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
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
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  params.category === cat.slug
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Sort */}
      <section className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {data?.pagination?.total || 0} products
        </p>
        <select
          value={params.sort}
          onChange={(e) => updateParams({ sort: e.target.value, page: "" })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.products?.length ? (
          <EmptyState
            title="No products found"
            message="Try adjusting your search or filters"
          />
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
      </section>
    </div>
  );
};

export default HomePage;
