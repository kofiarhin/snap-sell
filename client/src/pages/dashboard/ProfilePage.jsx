import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useUpdateProfile } from "../../hooks/mutations/useAuthMutations";
import ImageUpload from "../../components/ImageUpload";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const updateMutation = useUpdateProfile();
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({ fullName: user.fullName, email: user.email });
      setProfileImage(user.profileImage);
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      profileImage,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          <ImageUpload
            intent="profile"
            value={profileImage}
            onChange={setProfileImage}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            {...register("fullName", { required: "Required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Required" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
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

export default ProfilePage;
