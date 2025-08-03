import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type MediaType = "image" | "video";

export type UploadedFile = {
  file: File;
  preview: string;
  type: MediaType;
};

type MediaUploaderProps = {
  onUpload?: (file: UploadedFile) => void;
  isImageOnly?: boolean;
};

const MAX_FILE_SIZE_MB = 10;

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  isImageOnly = false,
}) => {
  const [media, setMedia] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (!file) return;

      const fileType: MediaType = file.type.startsWith?.("video")
        ? "video"
        : "image";

      const reader = new FileReader();
      reader.onloadend = () => {
        const uploaded: UploadedFile = {
          file,
          preview: reader.result as string,
          type: fileType,
        };
        setMedia(uploaded);
        onUpload?.(uploaded);
      };

      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: isImageOnly
      ? { "image/*": [] }
      : {
          "image/*": [],
          "video/*": [],
        },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024, // 10MB
    onDropRejected: () => setError("Invalid file type or size too large."),
  });

  return (
    <div className="w-full mx-auto">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed rounded-2xl cursor-pointer transition ${
          isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}>
        <input {...getInputProps()} />
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 16l4-4m0 0l4 4m-4-4v12m13-6h-6"
            />
          </svg>
          <p className="text-gray-500 text-center">
            Drag & drop a file or{" "}
            <span className="text-blue-600 underline">click to upload</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Image or video (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {media && (
        <div className="mt-4 relative w-full h-48">
          {media.type === "image" ? (
            <Image
              src={media.preview}
              alt="Preview"
              className="max-h-48 rounded-lg shadow"
              fill
              objectFit="contain"
            />
          ) : (
            <video
              src={media.preview}
              controls
              className="rounded-lg shadow max-h-64 w-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
