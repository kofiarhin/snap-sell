import { Link } from "react-router-dom";
import { HiSearch, HiArrowRight } from "react-icons/hi";

const pulseItems = [
  "Latest arrivals indexed every hour",
  "Image-first browsing with clear pricing",
  "Direct inquiry flow to verified sellers",
];

const HomeHero = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  productCount = 0,
  categoryCount = 0,
}) => {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-8 md:pt-12">
      <div className="grid min-h-[100dvh] gap-8 pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-14">
        <div className="space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
            SnapSell Marketplace
          </p>
          <h1 className="text-4xl leading-none tracking-tighter text-zinc-100 md:text-6xl">
            Shop distinctive products from independent sellers.
          </h1>
          <p className="max-w-[65ch] text-base leading-relaxed text-zinc-400">
            Explore curated listings across technology, home, and style. Filter quickly,
            compare visuals instantly, and connect with sellers in minutes.
          </p>

          <form onSubmit={onSearchSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              Search products
              <div className="relative">
                <HiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => onSearchInputChange(e.target.value)}
                  placeholder="Wireless camera, teak shelf, collector vinyl"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-3 pl-10 pr-3 text-zinc-100 outline-none transition focus:border-emerald-500"
                />
              </div>
            </label>
            <button
              type="submit"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/60 bg-emerald-500/20 px-5 py-3 font-medium text-emerald-200 transition hover:bg-emerald-500/30 active:scale-[0.98]"
            >
              Find listings <HiArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {pulseItems.map((item) => (
              <span key={item} className="rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-300">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <p className="text-sm text-zinc-400">Live marketplace inventory</p>
            <p className="mt-3 text-5xl tracking-tighter text-zinc-100">{productCount || 0}</p>
            <p className="mt-2 text-sm text-zinc-500">Updated continuously as new items publish.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <p className="text-sm text-zinc-400">Active categories</p>
            <p className="mt-3 text-5xl tracking-tighter text-zinc-100">{categoryCount || 0}</p>
            <p className="mt-2 text-sm text-zinc-500">Filter by category, price range, and newest drops.</p>
            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Browse full catalog <HiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
