import { HiCollection, HiCheckCircle, HiChatAlt2, HiArchive } from "react-icons/hi";
import { useMyProducts } from "../../hooks/queries/useProducts";
import { useSellerInquiries } from "../../hooks/queries/useInquiries";
import LoadingSpinner from "../../components/LoadingSpinner";

const metrics = [
  { key: "active", label: "Active Listings", icon: HiCollection },
  { key: "sold", label: "Sold", icon: HiCheckCircle },
  { key: "archived", label: "Archived", icon: HiArchive },
  { key: "newInquiries", label: "New Inquiries", icon: HiChatAlt2 },
];

const OverviewPage = () => {
  const { data: products, isLoading: loadingProducts } = useMyProducts();
  const { data: inquiries, isLoading: loadingInquiries } = useSellerInquiries();

  if (loadingProducts || loadingInquiries) return <LoadingSpinner />;

  const values = {
    active: products?.filter((p) => p.status === "active").length || 0,
    sold: products?.filter((p) => p.status === "sold").length || 0,
    archived: products?.filter((p) => ["archived", "inactive"].includes(p.status)).length || 0,
    newInquiries: inquiries?.filter((i) => i.status === "new").length || 0,
  };

  return (
    <div className="space-y-8">
      <header className="grid gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Seller dashboard</p>
        <h1 className="text-4xl tracking-tighter text-zinc-100">Operations overview</h1>
        <p className="max-w-[65ch] text-zinc-400">
          Track current inventory, completed sales, and fresh inquiries from one workspace.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ key, label, icon: Icon }) => (
          <article
            key={key}
            className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">{label}</p>
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-300">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-4xl tracking-tighter text-zinc-100">{values[key]}</p>
          </article>
        ))}
      </section>

      {!products?.length && (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-lg text-zinc-100">No listings yet</h2>
          <p className="mt-2 text-zinc-400">Create your first product listing to start receiving inquiries.</p>
        </section>
      )}
    </div>
  );
};

export default OverviewPage;
