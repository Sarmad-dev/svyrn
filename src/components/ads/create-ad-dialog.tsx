/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { createAd } from "@/lib/actions/ad.action";

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="text-gray-500 hover:text-gray-700">
        <svg
          className="w-4 h-4"
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
  );
};

export const CreateAd: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: session } = authClient.useSession();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-campaign"],
    mutationFn: async (campaignData: any) => {
      return await createAd({
        token: session?.session.token as string,
        data: campaignData,
      });
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    campaignType: "display",
    image: null as string | null,
    budget: 250,
    duration: 30,
  });

  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState("");

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCampaignTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, campaignType: type }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };

      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    await mutateAsync(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            New Ads Campaign
          </h2>
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
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <Input
              placeholder="Campaign Name"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Campaign Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Details
            </label>
            <textarea
              placeholder="Campaign Details"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Campaign Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Campaign Tags
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Campaign tags allow you to filter more effectively on the campaign
              view page
            </p>
            <div className="border border-gray-300 rounded-md p-3 min-h-[60px]">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    label={tag}
                    onRemove={() => handleRemoveTag(index)}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full border-none outline-none text-sm"
              />
            </div>
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Campaign Type (Importance)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleCampaignTypeChange("native")}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  formData.campaignType === "native"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">Native</h3>
                    <p className="text-sm text-gray-600">
                      This is an ads display as a news line
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCampaignTypeChange("display")}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  formData.campaignType === "display"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Display
                    </h3>
                    <p className="text-sm text-gray-600">
                      This ads display as a video media
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Add Image/Video - Only show for display type */}
          {formData.campaignType === "display" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Image / Video
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011 1v8a1 1 0 01-1 1H8a1 1 0 01-1-1V3a1 1 0 011-1m8 0H8m0 0v2m0 0v8m0 0h8m-8 0H4"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    Drag & drop file or{" "}
                    <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                      Browse
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileInput}
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="w-full h-[200px] relative">
                      <Image
                        src={formData.image}
                        alt="Uploaded Image"
                        fill
                        objectFit="contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Campaign Budget & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Campaign Budget & Time
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value={30}>30 days plan</option>
                  <option value={60}>60 days plan</option>
                  <option value={90}>90 days plan</option>
                </select>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className="w-full pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#4eaae9] hover:bg-[#3d8bc4] text-white py-3"
            disabled={isPending}>
            {isPending ? "Creating..." : "Create Ads"}
          </Button>
        </div>
      </div>
    </div>
  );
};
