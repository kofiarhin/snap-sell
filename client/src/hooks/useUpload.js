import { useState } from "react";
import { getUploadSignature, uploadToCloudinary } from "../services/uploadService";

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);

  const upload = async (file, intent) => {
    setUploading(true);
    try {
      const { data } = await getUploadSignature(intent);
      const result = await uploadToCloudinary(file, data.data);
      return result;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
};
