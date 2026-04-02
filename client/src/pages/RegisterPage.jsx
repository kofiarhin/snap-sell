import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRegister } from "../hooks/mutations/useAuthMutations";
import ImageUpload from "../components/ImageUpload";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const registerMutation = useRegister();
  const [profileImage, setProfileImage] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!profileImage) {
      toast.error("Profile image is required");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    registerMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      profileImage,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md ss-card-elevated">
        <h1 className="text-3xl ss-title text-center mb-8">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm ss-muted mb-1">Profile Image *</label>
            <ImageUpload intent="profile" value={profileImage} onChange={setProfileImage} isPublic />
          </div>

          <div>
            <label className="block text-sm ss-muted mb-1">Full Name</label>
            <input {...register("fullName", { required: "Full name is required" })} className="ss-input" />
            {errors.fullName && <p className="text-rose-300 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm ss-muted mb-1">Email</label>
            <input type="email" {...register("email", { required: "Email is required" })} className="ss-input" />
            {errors.email && <p className="text-rose-300 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm ss-muted mb-1">Password</label>
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

          <button type="submit" disabled={registerMutation.isPending} className="w-full ss-btn-primary disabled:opacity-50">
            {registerMutation.isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm ss-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--ss-brand)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
