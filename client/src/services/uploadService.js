import axios from "axios";
import { api } from "../lib/api";

export const getUploadSignature = (intent) =>
  api.post("/uploads/sign", { intent });

export const uploadToCloudinary = async (file, signatureData) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp);
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    formData
  );

  return {
    url: res.data.secure_url,
    publicId: res.data.public_id,
  };
};
