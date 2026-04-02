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
    <div className="ss-page">
      <div className="ss-shell p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <div className="rounded-2xl border bg-[rgb(10_13_21_/_0.82)] p-2 shadow-[0_14px_34px_rgb(2_5_14_/_0.45)]">
              <div className="aspect-square overflow-hidden rounded-xl bg-[rgb(8_11_18_/_0.94)]">
                <img
                  src={product.images[activeImage]?.url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-[rgb(10_13_21_/_0.9)] ${
                      i === activeImage
                        ? "border-[var(--ss-brand)]"
                        : "border-[rgb(255_255_255_/_0.12)] hover:border-[rgb(255_255_255_/_0.28)]"
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ss-card-elevated p-5 sm:p-6">
            <span className="inline-flex items-center rounded-full border border-[rgb(255_252_0_/_0.32)] bg-[rgb(255_252_0_/_0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ss-brand)]">
              {product.category?.label}
            </span>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-3xl font-bold text-[var(--ss-brand)]">
              ${product.price?.toFixed(2)}
            </p>

            {product.quantity > 0 && (
              <p className="mt-2 text-sm ss-muted">{product.quantity} available</p>
            )}

            {product.status !== "active" && (
              <span className="ss-badge-danger mt-3">{product.status}</span>
            )}

            <div className="ss-divider" />

            <div>
              <h2 className="text-base font-semibold text-white">Description</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-[rgb(223_230_244_/_0.92)]">
                {product.description}
              </p>
            </div>

            {product.seller && (
              <div className="mt-6 rounded-xl border bg-[rgb(18_24_36_/_0.85)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ss-muted)]">
                  Seller
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={product.seller.profileImage?.url}
                    alt={product.seller.fullName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[rgb(255_255_255_/_0.1)]"
                  />
                  <div>
                    <p className="font-medium text-white">{product.seller.fullName}</p>
                    <p className="text-sm ss-muted">Trusted seller</p>
                  </div>
                </div>
              </div>
            )}

            {product.status === "active" && (
              <button
                onClick={() => setShowInquiry(!showInquiry)}
                className="ss-btn-primary mt-6 w-full !py-3"
              >
                {showInquiry ? "Cancel" : "Contact Seller"}
              </button>
            )}

            {showInquiry && (
              <form
                onSubmit={handleSubmit(onSubmitInquiry)}
                className="mt-4 space-y-4 rounded-xl border bg-[rgb(12_16_25_/_0.82)] p-4 sm:p-5"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-[rgb(232_238_251_/_0.92)]">
                    <HiUser className="mr-1 inline h-4 w-4 text-[var(--ss-brand)]" />
                    Your Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="ss-input"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[rgb(232_238_251_/_0.92)]">
                    <HiMail className="mr-1 inline h-4 w-4 text-[var(--ss-brand)]" />
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="ss-input"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[rgb(232_238_251_/_0.92)]">
                    <HiPhone className="mr-1 inline h-4 w-4 text-[var(--ss-brand)]" />
                    Phone (optional)
                  </label>
                  <input {...register("phone")} className="ss-input" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[rgb(232_238_251_/_0.92)]">
                    <HiCurrencyDollar className="mr-1 inline h-4 w-4 text-[var(--ss-brand)]" />
                    Offer Amount (optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("offerAmount")}
                    className="ss-input"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[rgb(232_238_251_/_0.92)]">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    {...register("message", { required: "Message is required" })}
                    className="ss-textarea"
                    placeholder="I'm interested in this item..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={createInquiry.isPending}
                  className="ss-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createInquiry.isPending ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
