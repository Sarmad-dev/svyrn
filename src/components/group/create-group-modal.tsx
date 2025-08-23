"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import MediaUploader, { UploadedFile } from "../media-uploader";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/lib/actions/group.action";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "public",
  });
  const { data: session, isPending } = authClient.useSession();
  const [image, setImage] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isMutatePending } = useMutation({
    mutationKey: ["create-group"],
    mutationFn: async () =>
      await createGroup({
        token: session?.session.token as string,
        name: formData.name,
        description: formData.description,
        privacy: formData.privacy,
        image: image,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-groups"] });
      toast.success("Group created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setFormData({
        name: "",
        description: "",
        privacy: "public",
      });
      setImage("");

      queryClient.invalidateQueries({ queryKey: ["get-groups"] });
    },
  });

  const handleImageUpload = (file: UploadedFile) => {
    setImage(file.preview);
  };

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (privacy: string) => {
    setFormData((prev) => ({ ...prev, privacy }));
  };

  const handleSubmit = async () => {
    await mutateAsync();
  };

  const nameCharCount = formData.name.length;
  const descCharCount = formData.description.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Group
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              All fields are required unless otherwise indicated.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <Input
              placeholder="Enter a brief name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              maxLength={70}
              className="w-full"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {70 - nameCharCount} characters left
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter what your group is all about"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              maxLength={250}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {250 - descCharCount} characters left
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handlePrivacyChange("public")}
                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors min-w-0 ${
                  formData.privacy === "public"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.privacy === "public"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}>
                  {formData.privacy === "public" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    Public
                  </span>
                </div>
              </button>

              <button
                onClick={() => handlePrivacyChange("private")}
                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors min-w-0 ${
                  formData.privacy === "private"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.privacy === "private"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}>
                  {formData.privacy === "private" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    Private
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (Optional)
            </label>
            <MediaUploader isImageOnly onUpload={handleImageUpload} />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#4eaae9] hover:bg-[#3d8bc4] text-white py-3"
            disabled={isPending || isMutatePending}>
            {isMutatePending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create Group"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
