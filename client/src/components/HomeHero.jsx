<<<<<<< HEAD
import { Link } from "react-router-dom";
import { HiSearch } from "react-icons/hi";

const heroHighlights = [
  "Curated listings",
  "Direct seller contact",
  "Fresh arrivals daily",
];

const HomeHero = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  productCount = 0,
  categoryCount = 0,
}) => {
  const listingStat = productCount > 0 ? `${productCount}+` : "Fresh";
  const categoryStat = categoryCount > 0 ? `${categoryCount}` : "Curated";

  return (
    <section className="ss-page pt-6 md:pt-10">
      <div className="ss-hero-shell">
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="ss-hero-eyebrow">SnapSell Marketplace</span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Discover standout finds in a premium marketplace.
          </h1>

          <p className="ss-hero-copy mt-5">
            Search image-led listings from trusted sellers across tech, home,
            fashion, and more — all in one fast-moving feed.
          </p>

          <form onSubmit={onSearchSubmit} className="ss-hero-search">
            <div className="relative flex-1">
              <label htmlFor="home-search" className="sr-only">
                Search listings
              </label>
              <HiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7f8aa3]" />
              <input
                id="home-search"
                type="text"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder="Search listings, brands, or categories"
                className="ss-hero-input"
              />
            </div>

            <button
              type="submit"
              className="ss-btn-primary h-12 w-full px-5 sm:h-14 sm:w-auto sm:px-6"
            >
              Search marketplace
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {heroHighlights.map((item) => (
              <span key={item} className="ss-hero-tag">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link to="/products" className="ss-btn-secondary">
              Browse latest listings
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="ss-hero-stat text-center sm:text-left">
              <span className="ss-hero-stat-value">{listingStat}</span>
              <span className="ss-hero-stat-label">
                live listings ready to explore
              </span>
            </div>

            <div className="ss-hero-stat text-center sm:text-left">
              <span className="ss-hero-stat-value">{categoryStat}</span>
              <span className="ss-hero-stat-label">
                curated categories to refine the feed
              </span>
            </div>

            <div className="ss-hero-stat text-center sm:text-left">
              <span className="ss-hero-stat-value">Image-first</span>
              <span className="ss-hero-stat-label">
                browse visually with pricing up front
              </span>
            </div>
          </div>
=======
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
>>>>>>> agent-zero/implement-ui-redesign-plan-fve063
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
