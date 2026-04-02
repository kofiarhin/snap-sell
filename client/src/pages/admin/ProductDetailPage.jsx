import { useParams, Link, useNavigate } from "react-router-dom";
import { useAdminProducts } from "../../hooks/queries/useAdmin";
import { useCategories } from "../../hooks/queries/useCategories";
import { useAdminUpdateProduct, useAdminRemoveProduct } from "../../hooks/mutations/useAdminMutations";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiArrowLeft } from "react-icons/hi";

const AdminProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useAdminProducts();
  const { data: categories } = useCategories();
  const updateMutation = useAdminUpdateProduct();
  const removeMutation = useAdminRemoveProduct();

  const product = productsData?.products?.find((p) => p._id === id);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category?.value,
        status: product.status,
      });
    }
  }, [product, reset]);

  if (isLoading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <Link to="/admin/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          Back to products
        </Link>
      </div>
    );
  }

  const onSubmit = (data) => {
    updateMutation.mutate(
      { id: product._id, data: { ...data, price: Number(data.price) } },
      { onSuccess: () => reset(data) }
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
      removeMutation.mutate(product._id, {
        onSuccess: () => navigate("/admin/products"),
      });
    }
  };

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Images</h2>
            <div className="grid grid-cols-2 gap-2">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`${product.title} ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
            {product.seller && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Seller</p>
                <Link
                  to={`/admin/sellers/${product.seller._id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {product.seller.fullName}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { required: "Price is required", min: { value: 0, message: "Must be positive" } })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select...</option>
                    {(categories || []).map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="archived">Archived</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={removeMutation.isPending}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm disabled:opacity-50"
                >
                  Delete Product
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || updateMutation.isPending}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetailPage;
