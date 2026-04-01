import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useCategories } from "../../hooks/queries/useCategories";
import { useUpdateProduct } from "../../hooks/mutations/useProductMutations";
import ImageUpload from "../../components/ImageUpload";
import LoadingSpinner from "../../components/LoadingSpinner";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const updateMutation = useUpdateProduct();
  const [images, setImages] = useState([]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", "edit", id],
    queryFn: async () => {
      const res = await api.get(`/products/seller/me`);
      return res.data.data.find((p) => p._id === id);
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category?.value,
      });
      setImages(product.images || []);
    }
  }, [product, reset]);

  const onSubmit = (data) => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    updateMutation.mutate(
      {
        id,
        data: {
          title: data.title,
          description: data.description,
          price: Number(data.price),
          quantity: Number(data.quantity),
          category: data.category,
          images,
        },
      },
      { onSuccess: () => navigate("/dashboard/listings") }
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images *
          </label>
          <ImageUpload intent="product" value={images} onChange={setImages} multiple />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            rows={5}
            {...register("description", { required: "Description is required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Required" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              {...register("quantity", { required: "Required" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            {...register("category", { required: "Required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditListingPage;
