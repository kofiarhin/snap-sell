import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useCategories } from "../../hooks/queries/useCategories";
import { useCreateProduct } from "../../hooks/mutations/useProductMutations";
import ImageUpload from "../../components/ImageUpload";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const CreateListingPage = () => {
  const { data: categories, isLoading: loadingCats } = useCategories();
  const createMutation = useCreateProduct();
  const [images, setImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    createMutation.mutate({
      title: data.title,
      description: data.description,
      price: Number(data.price),
      quantity: Number(data.quantity),
      category: data.category,
      images,
    });
  };

  if (loadingCats) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Listing</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images *
          </label>
          <ImageUpload
            intent="product"
            value={images}
            onChange={setImages}
            multiple
          />
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
              {...register("price", { required: "Price is required", min: { value: 0, message: "Must be positive" } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              defaultValue={1}
              {...register("quantity", { required: "Quantity is required", min: { value: 0, message: "Must be positive" } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {createMutation.isPending ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;
