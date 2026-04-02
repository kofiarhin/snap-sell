import { HiSearch } from "react-icons/hi";

const HomeHero = ({ searchInput, onSearchInputChange, onSubmit }) => {
  return (
    <section className="ss-page pt-8 sm:pt-12">
      <div className="ss-home-hero">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="ss-home-kicker">SnapSell Marketplace</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Discover quality products from trusted local sellers.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[var(--ss-muted)] max-w-2xl mx-auto">
            Search faster, compare listings instantly, and connect directly with sellers in one modern marketplace.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ss-muted)]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder="Search products, categories, or sellers"
                className="ss-input !pl-10 !py-3"
              />
            </div>
            <button type="submit" className="ss-btn-primary !px-6 !py-3">
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
