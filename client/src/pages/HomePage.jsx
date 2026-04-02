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
<<<<<<< HEAD
import "../styles/home.css";
=======
>>>>>>> agent-zero/implement-ui-redesign-plan-fve063

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
  const activeCategory = categories?.find(
    (category) => category.slug === params.category
  );

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
<<<<<<< HEAD
    <div className="pb-8">
      <HomeHero
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearch}
        productCount={data?.pagination?.total || 0}
        categoryCount={categories?.length || 0}
      />

      {categories?.length > 0 && (
        <CategoryRail
          categories={categories}
          activeCategory={params.category}
          onCategoryChange={(category) =>
            updateParams({ category, page: "" })
          }
        />
      )}

      <section className="ss-page pt-3 md:pt-4">
        <div className="ss-filter-bar">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(255_255_255_/_0.42)]">
              Marketplace feed
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                Latest listings
              </h2>
              <span className="ss-chip">
                {data?.pagination?.total || 0} products
              </span>
              {activeCategory && (
                <span className="ss-chip ss-chip-active">
                  {activeCategory.label}
                </span>
              )}
            </div>
          </div>

          <label className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
            <span className="ss-muted whitespace-nowrap">Sort by</span>
            <select
              value={params.sort}
              onChange={(e) => updateParams({ sort: e.target.value, page: "" })}
              className="ss-select min-w-[12rem]"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </label>
        </div>
      </section>

      <section className="ss-page pt-6 md:pt-8">
=======
    <div>
      <HomeHero
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSubmit={handleSearch}
      />

      <CategoryRail
        categories={categories}
        activeCategory={params.category}
        onSelect={(category) => updateParams({ category, page: "" })}
      />

      <section className="ss-page py-4">
        <div className="ss-panel !p-4 flex justify-between items-center gap-4">
          <p className="text-sm ss-muted">{data?.pagination?.total || 0} products</p>
          <select
            value={params.sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: "" })}
            className="ss-select !w-auto min-w-48"
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
        </div>
      </section>

      <section className="ss-page pt-2">
>>>>>>> agent-zero/implement-ui-redesign-plan-fve063
        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.products?.length ? (
          <EmptyState title="No products found" message="Try adjusting your search or filters" />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
