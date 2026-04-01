import { useParams } from "react-router-dom";
import { useState } from "react";
import { useProduct } from "../hooks/queries/useProducts";
import { useCreateInquiry } from "../hooks/mutations/useInquiryMutations";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiMail, HiPhone, HiUser, HiCurrencyDollar } from "react-icons/hi";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const createInquiry = useCreateInquiry();
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitInquiry = (data) => {
    createInquiry.mutate(
      {
        productId: product._id,
        buyerName: data.name,
        buyerEmail: data.email,
        buyerPhone: data.phone,
        message: data.message,
        offerAmount: data.offerAmount ? Number(data.offerAmount) : undefined,
      },
      {
        onSuccess: () => {
          reset();
          setShowInquiry(false);
        },
      }
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-16">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            <img
              src={product.images[activeImage]?.url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImage ? "border-indigo-600" : "border-gray-200"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {product.category?.label}
          </span>
          <h1 className="text-3xl font-bold mt-3 text-gray-900">{product.title}</h1>
          <p className="text-3xl font-bold text-indigo-600 mt-4">
            ${product.price?.toFixed(2)}
          </p>

          {product.quantity > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {product.quantity} available
            </p>
          )}

          {product.status !== "active" && (
            <span className="inline-block mt-2 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
              {product.status}
            </span>
          )}

          <div className="mt-6">
            <h2 className="font-medium text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Seller */}
          {product.seller && (
            <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={product.seller.profileImage?.url}
                alt={product.seller.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{product.seller.fullName}</p>
                <p className="text-sm text-gray-500">Seller</p>
              </div>
            </div>
          )}

          {/* Contact Seller Button */}
          {product.status === "active" && (
            <button
              onClick={() => setShowInquiry(!showInquiry)}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
            >
              {showInquiry ? "Cancel" : "Contact Seller"}
            </button>
          )}

          {/* Inquiry Form */}
          {showInquiry && (
            <form onSubmit={handleSubmit(onSubmitInquiry)} className="mt-4 space-y-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <HiUser className="inline w-4 h-4 mr-1" />
                  Your Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <HiMail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <HiPhone className="inline w-4 h-4 mr-1" />
                  Phone (optional)
                </label>
                <input
                  {...register("phone")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <HiCurrencyDollar className="inline w-4 h-4 mr-1" />
                  Offer Amount (optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("offerAmount")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  {...register("message", { required: "Message is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="I'm interested in this item..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={createInquiry.isPending}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {createInquiry.isPending ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
