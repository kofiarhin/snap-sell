const CategoryRail = ({ categories, activeCategory, onSelect }) => {
  if (!categories?.length) return null;

  return (
    <section className="ss-page pt-0">
      <div className="ss-category-rail" role="tablist" aria-label="Filter products by category">
        <button
          type="button"
          onClick={() => onSelect("")}
          className={`ss-category-chip ${!activeCategory ? "ss-category-chip-active" : ""}`}
          aria-pressed={!activeCategory}
        >
          All
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelect(cat.slug)}
              className={`ss-category-chip ${isActive ? "ss-category-chip-active" : ""}`}
              aria-pressed={isActive}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryRail;
