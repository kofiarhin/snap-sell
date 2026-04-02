import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-3 shadow-[0_16px_30px_-18px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 hover:border-zinc-700"
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-zinc-950/60">
        <img
          src={product.images?.[0]?.url}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-2 px-1 pb-1 pt-4">
        <h3 className="truncate text-base font-medium text-zinc-100">{product.title}</h3>
        <p className="text-lg font-semibold text-emerald-300">${product.price?.toFixed(2)}</p>
        <div className="flex items-center justify-between gap-2 text-sm text-zinc-400">
          <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300">
            {product.category?.label}
          </span>
          {product.seller?.fullName && <span className="truncate">{product.seller.fullName}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
