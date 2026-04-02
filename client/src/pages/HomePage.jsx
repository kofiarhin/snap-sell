import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/queries/useProducts";
import { useCategories } from "../hooks/queries/useCategories";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import HomeHero from "../components/HomeHero";
import CategoryRail from "../components/CategoryRail";

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
  const activeCategory = categories?.find((category) => category.slug === params.category);

  const updateParams = (updates) => {
    const newParams = { ...Object.fromEntries(searchParams), ...updates };
    Object.keys(newParams).forEach((key) => {
      if (!newParams[key]) delete newParams[key];
    });
    setSearchParams(newParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchInput, page: "" });
  };

  return (
    <div className="pb-10">
      <HomeHero
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearch}
        productCount={data?.pagination?.total || 0}
        categoryCount={categories?.length || 0}
      />

      <CategoryRail
        categories={categories}
        activeCategory={params.category}
        onCategoryChange={(category) => updateParams({ category, page: "" })}
      />

      <section className="mx-auto max-w-[1400px] px-4 pt-6 md:pt-8">
        <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Marketplace feed</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl tracking-tight text-zinc-100">Latest Listings</h2>
              <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300">
                {data?.pagination?.total || 0} products
              </span>
              {activeCategory && (
                <span className="rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-200">
                  {activeCategory.label}
                </span>
              )}
            </div>
          </div>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            Sort by
            <select
              value={params.sort}
              onChange={(event) => updateParams({ sort: event.target.value, page: "" })}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-200 outline-none md:min-w-[12rem]"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pt-6 md:pt-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.products?.length ? (
          <EmptyState title="No products found" message="Try adjusting your search or filters" />
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

export default HomePage;
