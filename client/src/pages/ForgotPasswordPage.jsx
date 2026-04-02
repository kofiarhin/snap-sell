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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-center text-gray-500 mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        {forgotMutation.isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700">
              If an account with that email exists, a password reset link has been sent. Check your inbox.
            </p>
            <Link to="/login" className="mt-4 inline-block text-indigo-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
