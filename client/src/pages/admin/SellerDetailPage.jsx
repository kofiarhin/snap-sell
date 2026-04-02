import { useParams, Link } from "react-router-dom";
import { useAdminSeller, useAdminProducts } from "../../hooks/queries/useAdmin";
import { useSuspendSeller, useActivateSeller } from "../../hooks/mutations/useAdminMutations";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiArrowLeft } from "react-icons/hi";

const AdminSellerDetailPage = () => {
  const { id } = useParams();
  const { data: seller, isLoading } = useAdminSeller(id);
  const { data: productsData } = useAdminProducts({ seller: id });
  const suspendMutation = useSuspendSeller();
  const activateMutation = useActivateSeller();

  if (isLoading) return <LoadingSpinner />;

  if (!seller) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Seller not found</h2>
        <Link to="/admin/sellers" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          Back to sellers
        </Link>
      </div>
    );
  }

  const products = productsData?.products || [];
  const statusCounts = products.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div>
      <Link to="/admin/sellers" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to sellers
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {seller.profileImage?.url ? (
              <img src={seller.profileImage.url} alt={seller.fullName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{seller.fullName}</h1>
              <p className="text-gray-500">{seller.email}</p>
              <span
                className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  seller.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {seller.isActive ? "Active" : "Suspended"}
              </span>
            </div>
          </div>

          <div>
            {seller.isActive ? (
              <button
                onClick={() => suspendMutation.mutate(seller._id)}
                disabled={suspendMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Suspend Seller
              </button>
            ) : (
              <button
                onClick={() => activateMutation.mutate(seller._id)}
                disabled={activateMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Activate Seller
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-sm text-gray-500">Total Products</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{statusCounts.active || 0}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{statusCounts.sold || 0}</p>
            <p className="text-sm text-gray-500">Sold</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{statusCounts.archived || 0}</p>
            <p className="text-sm text-gray-500">Archived</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Joined {new Date(seller.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Seller's Products */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
      {!products.length ? (
        <p className="text-gray-500">No products found for this seller.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url && (
                          <img src={product.images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                        )}
                        <span className="font-medium text-gray-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : product.status === "sold"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{product.category?.label}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellerDetailPage;
