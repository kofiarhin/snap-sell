import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { useProducts } from "../hooks/queries/useProducts";
import { useCategories } from "../hooks/queries/useCategories";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CategoryRail from "../components/CategoryRail";

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
    <div className="pb-10">
      <section className="mx-auto max-w-[1400px] px-4 pb-2 pt-8 md:pt-10">
        <div className="grid gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Catalog</p>
            <h1 className="mt-2 text-4xl tracking-tighter text-zinc-100 md:text-5xl">Browse all products</h1>
            <p className="mt-3 max-w-[65ch] text-zinc-400">
              Refine by keyword, category, and sort order to quickly narrow down relevant listings.
            </p>
          </div>

          <div className="space-y-3">
            <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Search listings
                <div className="relative">
                  <HiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by title or description"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 py-2.5 pl-10 pr-3 text-zinc-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </label>
              <button
                type="submit"
                className="mt-auto rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-4 py-2.5 font-medium text-emerald-200 transition hover:bg-emerald-500/30 active:scale-[0.98]"
              >
                Search
              </button>
            </form>

            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              Sort listings
              <select
                value={params.sort}
                onChange={(e) => updateParams({ sort: e.target.value, page: "" })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-200 outline-none sm:w-auto"
              >
                <option value="-createdAt">Newest</option>
                <option value="createdAt">Oldest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <CategoryRail
        categories={categories}
        activeCategory={params.category}
        onCategoryChange={(category) => updateParams({ category, page: "" })}
      />

      <section className="mx-auto max-w-[1400px] px-4 pt-6">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.products?.length ? (
          <EmptyState title="No products found" message="Try another category or broaden your keyword." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination pagination={data.pagination} onPageChange={(page) => updateParams({ page })} />
          </>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
