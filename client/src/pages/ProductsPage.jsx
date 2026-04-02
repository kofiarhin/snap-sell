import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../hooks/queries/useProducts";
import { useCategories } from "../hooks/queries/useCategories";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CategoryRail from "../components/CategoryRail";
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
    <div className="pb-8">
      <section className="ss-page pb-4 md:pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">All Products</h1>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <HiSearch className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[rgb(154_164_184_/_0.85)]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="ss-input pl-10"
              />
            </div>
            <button type="submit" className="ss-btn-primary px-4 py-2.5">
              Search
            </button>
          </form>

          <select
            value={params.sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: "" })}
            className="ss-select w-full sm:w-auto"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>
      </section>

      <CategoryRail
        categories={categories}
        activeCategory={params.category}
        onCategoryChange={(category) => updateParams({ category, page: "" })}
      />

      <section className="ss-page pt-4 md:pt-6">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.products?.length ? (
          <EmptyState title="No products found" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
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

export default ProductsPage;
