import { useForm } from "react-hook-form";
import { useParams, Link } from "react-router-dom";
import { useResetPassword } from "../hooks/mutations/useAuthMutations";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const resetMutation = useResetPassword();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    resetMutation.mutate({ token, data });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md ss-card-elevated">
        <h1 className="text-3xl ss-title text-center mb-2">Reset Password</h1>
        <p className="text-center ss-muted mb-8">Enter your new password below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm ss-muted mb-1">New Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              className="ss-input"
            />
            {errors.password && <p className="text-rose-300 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm ss-muted mb-1">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (val) => val === watch("password") || "Passwords do not match",
              })}
              className="ss-input"
            />
            {errors.confirmPassword && <p className="text-rose-300 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={resetMutation.isPending} className="w-full ss-btn-primary disabled:opacity-50">
            {resetMutation.isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm ss-muted mt-6">
          <Link to="/login" className="text-[var(--ss-brand)] hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
