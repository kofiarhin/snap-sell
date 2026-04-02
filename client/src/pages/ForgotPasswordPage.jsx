import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/mutations/useAuthMutations";

const ForgotPasswordPage = () => {
  const forgotMutation = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    forgotMutation.mutate(data);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md ss-card-elevated">
        <h1 className="text-3xl ss-title text-center mb-2">Forgot Password</h1>
        <p className="text-center ss-muted mb-8">Enter your email and we'll send you a reset link.</p>

        {forgotMutation.isSuccess ? (
          <div className="ss-panel text-center">
            <p className="text-emerald-300">If an account exists, a password reset link has been sent.</p>
            <Link to="/login" className="mt-4 inline-block text-[var(--ss-brand)] hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm ss-muted mb-1">Email</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="ss-input" placeholder="you@example.com" />
              {errors.email && <p className="text-rose-300 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={forgotMutation.isPending} className="w-full ss-btn-primary disabled:opacity-50">
              {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm ss-muted mt-6">
          Remember your password? <Link to="/login" className="text-[var(--ss-brand)] hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
