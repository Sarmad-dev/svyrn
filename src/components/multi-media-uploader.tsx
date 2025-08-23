import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Plus, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaType = "image" | "video";

export type UploadedFile = {
  id: string;
  file: File;
  preview: string; // URL.createObjectURL for display
  base64: string; // Base64 for backend
  type: MediaType;
};

type MultiMediaUploaderProps = {
  onUpload?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  isImageOnly?: boolean;
};

const MAX_FILE_SIZE_MB = 10;
const DEFAULT_MAX_FILES = 10;

const MultiMediaUploader: React.FC<MultiMediaUploaderProps> = ({
  onUpload,
  maxFiles = DEFAULT_MAX_FILES,
  isImageOnly = false,
}) => {
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      mediaFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [mediaFiles]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (mediaFiles.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
        return;
      }

      const newFiles: UploadedFile[] = [];

      acceptedFiles.forEach((file) => {
        const fileType: MediaType = file.type.startsWith?.("video")
          ? "video"
          : "image";

        // Create base64 for backend
        const reader = new FileReader();
        reader.onloadend = () => {
          const uploaded: UploadedFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: reader.result as string,
            base64: reader.result as string,
            type: fileType,
          };

          newFiles.push(uploaded);

          if (newFiles.length === acceptedFiles.length) {
            const updatedFiles = [...mediaFiles, ...newFiles];
            setMediaFiles(updatedFiles);
            onUpload?.(updatedFiles);
          }
        };

        reader.readAsDataURL(file);
      });
    },
    [mediaFiles, maxFiles, onUpload]
  );

  const removeFile = (id: string) => {
    const fileToRemove = mediaFiles.find((file) => file.id === id);
    if (fileToRemove) {
      // Clean up the object URL to prevent memory leaks
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = mediaFiles.filter((file) => file.id !== id);
    setMediaFiles(updatedFiles);
    onUpload?.(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: isImageOnly
      ? { "image/*": [] }
      : {
          "image/*": [],
          "video/*": [],
        },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024, // 10MB
    onDropRejected: () => setError("Invalid file type or size too large."),
  });

  const renderPreviewGrid = () => {
    if (mediaFiles.length === 0) return null;

    const getGridLayout = (count: number) => {
      switch (count) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-2";
        case 3:
          return "grid-cols-3";
        case 4:
          return "grid-cols-2";
        default:
          return "grid-cols-3";
      }
    };

    const getItemSize = (count: number, index: number) => {
      if (count === 1) return "h-48";
      if (count === 2) return "h-40";
      if (count === 3) return "h-32";
      if (count === 4) {
        return index === 0 ? "col-span-2 row-span-2 h-32" : "h-20";
      }
      return "h-20";
    };

    return (
      <div className={`grid ${getGridLayout(mediaFiles.length)} gap-2 mt-4`}>
        {mediaFiles.map((file, index) => (
          <div
            key={file.id}
            className={`relative ${getItemSize(mediaFiles.length, index)} group bg-gray-100 rounded-lg overflow-hidden`}
          >
            {file.type === "image" ? (
              <img
                src={file.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full rounded-lg object-cover"
                onLoad={() =>
                  console.log("Image loaded successfully:", file.id)
                }
                onError={(e) => {
                  console.error("Image failed to load:", file.id, e);
                  console.log("Preview URL:", file.preview);
                }}
              />
            ) : (
              <video
                src={file.preview}
                className="w-full h-full rounded-lg object-cover"
                muted
                onLoadedData={() =>
                  console.log("Video loaded successfully:", file.id)
                }
                onError={(e) => {
                  console.error("Video failed to load:", file.id, e);
                  console.log("Preview URL:", file.preview);
                }}
              />
            )}

            {/* Overlay with remove button */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-3 w-3" />
              </Button>

              {/* File type indicator */}
              <div className="absolute bottom-1 left-1">
                {file.type === "video" ? (
                  <Video className="h-3 w-3 text-white" />
                ) : (
                  <ImageIcon className="h-3 w-3 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const canAddMore = mediaFiles.length < maxFiles;

  return (
    <div className="w-full mx-auto">
      {canAddMore && (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition ${
            isDragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Plus className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-center text-sm">
            {mediaFiles.length === 0 ? (
              <>
                Drag & drop files or{" "}
                <span className="text-blue-600 underline">click to upload</span>
              </>
            ) : (
              <>
                Add more files or{" "}
                <span className="text-blue-600 underline">click to upload</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isImageOnly ? "Images only" : "Images and videos"} (max{" "}
            {MAX_FILE_SIZE_MB}MB each)
          </p>
          {mediaFiles.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {mediaFiles.length}/{maxFiles} files selected
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {renderPreviewGrid()}
    </div>
  );
};

export default MultiMediaUploader;
