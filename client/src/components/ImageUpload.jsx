import { useRef, useState } from "react";
import { HiPhotograph, HiX } from "react-icons/hi";
import { useUpload } from "../hooks/useUpload";
import toast from "react-hot-toast";

const ImageUpload = ({ intent, value, onChange, multiple = false, isPublic = false }) => {
  const { upload, uploading } = useUpload({ isPublic });
  const inputRef = useRef();
  const [previews, setPreviews] = useState([]);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const results = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);
          continue;
        }
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        const result = await upload(file, intent);
        results.push(result);
      }

      if (multiple) {
        const updated = [...(value || []), ...results];
        onChange(updated);
        setPreviews(updated.map((img) => img.url));
      } else if (results.length > 0) {
        onChange(results[0]);
        setPreviews([results[0].url]);
      }
    } catch {
      toast.error("Upload failed");
    }

    e.target.value = "";
  };

  const removeImage = (index) => {
    if (multiple) {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
      setPreviews(updated.map((img) => img.url));
    } else {
      onChange(null);
      setPreviews([]);
    }
  };

  const displayImages = multiple
    ? (value || []).map((img) => img.url)
    : value?.url
      ? [value.url]
      : previews;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {displayImages.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[rgb(255_255_255_/_0.15)] bg-[rgb(255_255_255_/_0.03)]">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 ss-btn-danger !p-1"
            >
              <HiX className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 border border-dashed border-[rgb(255_255_255_/_0.25)] rounded-lg ss-muted hover:border-[var(--ss-brand)] hover:text-[var(--ss-brand)] disabled:opacity-50"
      >
        <HiPhotograph className="w-5 h-5" />
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
