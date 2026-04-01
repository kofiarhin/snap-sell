import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
        <p className="text-indigo-600 font-semibold mt-1">
          ${product.price?.toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
            {product.category?.label}
          </span>
          {product.seller?.fullName && (
            <span className="truncate ml-2">{product.seller.fullName}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
