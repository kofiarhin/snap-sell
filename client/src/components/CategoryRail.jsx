const CategoryRail = ({ categories = [], activeCategory, onCategoryChange }) => {
  if (!categories.length) return null;

  return (
    <section className="ss-page pt-2 md:pt-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(255_252_0_/_0.78)]">
            Explore
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Browse by category
          </h2>
          <p className="ss-muted mt-2 max-w-2xl text-sm sm:text-base">
            Use the category rail to sharpen the feed without breaking your
            browsing flow.
          </p>
        </div>

        {activeCategory && (
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className="ss-btn-ghost self-start md:self-auto"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="ss-category-rail" role="toolbar" aria-label="Product categories">
        <button
          type="button"
          onClick={() => onCategoryChange("")}
          aria-pressed={!activeCategory}
          className={`ss-category-chip ${!activeCategory ? "ss-category-chip-active" : ""}`}
        >
          All
        </button>

        {categories.map((category) => {
          const isActive = activeCategory === category.slug;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              aria-pressed={isActive}
              className={`ss-category-chip ${isActive ? "ss-category-chip-active" : ""}`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryRail;
