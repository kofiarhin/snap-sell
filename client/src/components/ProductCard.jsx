import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group ss-card-elevated overflow-hidden hover:-translate-y-0.5 hover:border-[rgb(255_255_255_/_0.22)]"
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-[rgb(255_255_255_/_0.03)]">
        <img
          src={product.images?.[0]?.url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="pt-4">
        <h3 className="font-medium text-white truncate">{product.title}</h3>
        <p className="text-[var(--ss-brand)] font-semibold mt-1">${product.price?.toFixed(2)}</p>
        <div className="flex items-center justify-between mt-2 text-sm ss-muted">
          <span className="ss-chip">{product.category?.label}</span>
          {product.seller?.fullName && <span className="truncate ml-2">{product.seller.fullName}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
