import { useForm } from "react-hook-form";
import { useChangePassword } from "../../hooks/mutations/useAuthMutations";

const PasswordPage = () => {
  const changeMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    changeMutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            {...register("currentPassword", { required: "Required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            {...register("newPassword", {
              required: "Required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Required",
              validate: (val) => val === watch("newPassword") || "Passwords do not match",
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={changeMutation.isPending}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {changeMutation.isPending ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordPage;
