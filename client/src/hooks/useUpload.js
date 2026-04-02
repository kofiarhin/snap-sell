import { useState } from "react";
import { getUploadSignature, getPublicUploadSignature, uploadToCloudinary } from "../services/uploadService";

export const useUpload = ({ isPublic = false } = {}) => {
  const [uploading, setUploading] = useState(false);

  const upload = async (file, intent) => {
    setUploading(true);
    try {
      const signFn = isPublic ? getPublicUploadSignature : getUploadSignature;
      const { data } = await signFn(intent);
      const result = await uploadToCloudinary(file, data.data);
      return result;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
};
