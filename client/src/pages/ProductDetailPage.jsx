import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiMail, HiPhone, HiUser, HiCurrencyDollar } from "react-icons/hi";
import { useProduct } from "../hooks/queries/useProducts";
import { useCreateInquiry } from "../hooks/mutations/useInquiryMutations";
import LoadingSpinner from "../components/LoadingSpinner";

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
  if (!product) return <div className="py-16 text-center text-zinc-300">Product not found</div>;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:py-10">
      <div className="grid gap-7 md:grid-cols-[1.2fr_0.8fr] md:gap-10">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="aspect-square overflow-hidden rounded-2xl bg-zinc-950/70">
              <img src={product.images[activeImage]?.url} alt={product.title} className="h-full w-full object-cover" />
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId || i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border p-0.5 transition ${
                    i === activeImage
                      ? "border-emerald-500 bg-emerald-500/20"
                      : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700"
                  }`}
                >
                  <img src={img.url} alt="Product view" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <span className="inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
            {product.category?.label}
          </span>
          <h1 className="mt-4 text-4xl tracking-tighter text-zinc-100">{product.title}</h1>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-emerald-300">${product.price?.toFixed(2)}</p>
          {product.quantity > 0 && <p className="mt-2 text-sm text-zinc-400">{product.quantity} currently available</p>}

          <div className="mt-6 border-t border-zinc-800 pt-6">
            <h2 className="text-sm uppercase tracking-[0.16em] text-zinc-500">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-300">{product.description}</p>
          </div>

          {product.seller && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Seller</p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={product.seller.profileImage?.url}
                  alt={product.seller.fullName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-zinc-100">{product.seller.fullName}</p>
                  <p className="text-sm text-zinc-400">Verified marketplace account</p>
                </div>
              </div>
            </div>
          )}

          {product.status === "active" && (
            <button
              onClick={() => setShowInquiry(!showInquiry)}
              className="mt-6 w-full rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-4 py-3 font-medium text-emerald-200 transition hover:bg-emerald-500/30 active:scale-[0.98]"
            >
              {showInquiry ? "Close inquiry form" : "Contact seller"}
            </button>
          )}

          {showInquiry && (
            <form onSubmit={handleSubmit(onSubmitInquiry)} className="mt-5 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1"><HiUser /> Your name</span>
                <input {...register("name", { required: "Name is required" })} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100" />
                <span className="text-xs text-zinc-500">Use your full name so sellers can identify your inquiry.</span>
                {errors.name && <span className="text-sm text-rose-300">{errors.name.message}</span>}
              </label>

              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1"><HiMail /> Email</span>
                <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100" />
                {errors.email && <span className="text-sm text-rose-300">{errors.email.message}</span>}
              </label>

              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1"><HiPhone /> Phone</span>
                <input {...register("phone")} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100" />
              </label>

              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1"><HiCurrencyDollar /> Offer amount</span>
                <input type="number" step="0.01" {...register("offerAmount")} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100" />
              </label>

              <label className="flex flex-col gap-2 text-sm text-zinc-300">
                Message
                <textarea
                  rows={4}
                  {...register("message", { required: "Message is required" })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-100"
                  placeholder="Share pickup timeline, delivery preferences, or additional questions"
                />
                {errors.message && <span className="text-sm text-rose-300">{errors.message.message}</span>}
              </label>

              <button
                type="submit"
                disabled={createInquiry.isPending}
                className="w-full rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-4 py-3 font-medium text-emerald-200 transition hover:bg-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createInquiry.isPending ? "Sending inquiry..." : "Send inquiry"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
