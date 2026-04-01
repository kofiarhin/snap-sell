const cloudinary = require("../config/cloudinary");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const ALLOWED_INTENTS = {
  profile: { folder: "snapsell/profiles", resourceType: "image" },
  product: { folder: "snapsell/products", resourceType: "image" },
};

const generateSignature = (intent) => {
  const config = ALLOWED_INTENTS[intent];
  if (!config) {
    throw new AppError("Invalid upload intent", 400, "VALIDATION_ERROR");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp,
    folder: config.folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    folder: config.folder,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
  };
};

const deleteAsset = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", publicId, error.message);
  }
};

const deleteMultipleAssets = async (publicIds) => {
  const promises = publicIds.filter(Boolean).map((id) => deleteAsset(id));
  await Promise.allSettled(promises);
};

module.exports = { generateSignature, deleteAsset, deleteMultipleAssets };
