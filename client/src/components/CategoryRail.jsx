const CategoryRail = ({ categories = [], activeCategory, onCategoryChange }) => {
  if (!categories.length) return null;

  return (
    <section className="ss-page pt-2 md:pt-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="ss-section-eyebrow">
            Categories
          </p>
          <h2 className="ss-section-title">
            Browse by category
          </h2>
        </div>

        {activeCategory && (
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className="ss-category-clear"
          >
            Clear
          </button>
        )}
      </div>

      <div
        className="ss-category-rail-wrap mt-4"
        role="toolbar"
        aria-label="Product categories"
      >
        <div className="ss-category-fade-left" aria-hidden="true" />
        <div className="ss-category-fade-right" aria-hidden="true" />

        <div className="ss-category-track" role="group" aria-label="Category filters">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            aria-pressed={!activeCategory}
            className={`ss-category-tab ${!activeCategory ? "ss-category-tab-active" : ""}`}
          >
            <span className="relative z-10">All</span>
          </button>

          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => onCategoryChange(category.slug)}
                aria-pressed={isActive}
                className={`ss-category-tab ${isActive ? "ss-category-tab-active" : ""}`}
              >
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryRail;
