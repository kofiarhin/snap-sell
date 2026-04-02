const required = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
};

const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

export const env = {
  apiUrl: required.VITE_API_URL,
  cloudinaryCloudName: required.VITE_CLOUDINARY_CLOUD_NAME,
};
