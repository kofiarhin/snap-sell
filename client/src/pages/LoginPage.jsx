import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/mutations/useAuthMutations";

const LoginPage = () => {
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md ss-card-elevated">
        <h1 className="text-3xl ss-title text-center mb-8">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm ss-muted mb-1">Email</label>
            <input type="email" {...register("email", { required: "Email is required" })} className="ss-input" />
            {errors.email && <p className="text-rose-300 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm ss-muted mb-1">Password</label>
            <input type="password" {...register("password", { required: "Password is required" })} className="ss-input" />
            {errors.password && <p className="text-rose-300 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-[var(--ss-brand)] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loginMutation.isPending} className="w-full ss-btn-primary disabled:opacity-50">
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm ss-muted mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--ss-brand)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
