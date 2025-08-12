/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage } from "@/lib/actions/page.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Upload, Globe, Users, Shield, Building2, Image, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const categories = [
  { value: "business", label: "Business", icon: Building2 },
  { value: "entertainment", label: "Entertainment", icon: Building2 },
  { value: "news", label: "News", icon: Building2 },
  { value: "sports", label: "Sports", icon: Building2 },
  { value: "technology", label: "Technology", icon: Building2 },
  { value: "fashion", label: "Fashion", icon: Building2 },
  { value: "food", label: "Food & Dining", icon: Building2 },
  { value: "travel", label: "Travel & Tourism", icon: Building2 },
  { value: "health", label: "Health & Wellness", icon: Building2 },
  { value: "education", label: "Education", icon: Building2 },
  { value: "other", label: "Other", icon: Building2 },
];

export default function CreatePagePage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    description: "",
    category: "",
    privacy: "public",
    allowComments: true,
    allowReactions: true,
    allowSharing: true,
    notifyOnFollow: true,
    notifyOnComment: true,
  });

  const [images, setImages] = useState({
    profilePicture: "",
    coverPhoto: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPageMutation = useMutation({
    mutationFn: createPage,
    onSuccess: (data) => {
      toast.success("Page created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-pages"] });
      router.push(`/pages/${data._id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create page");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.username && !/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      toast.error("Username can only contain letters, numbers, dots, and underscores");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createPageMutation.mutateAsync({
        token: session?.session?.token as string,
        name: formData.name,
        username: formData.username || undefined,
        description: formData.description || undefined,
        category: formData.category,
        privacy: formData.privacy,
        profilePicture: images.profilePicture || undefined,
        coverPhoto: images.coverPhoto || undefined,
      });
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (type: 'profilePicture' | 'coverPhoto', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImages(prev => ({
        ...prev,
        [type]: base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'profilePicture' | 'coverPhoto') => {
    setImages(prev => ({
      ...prev,
      [type]: ""
    }));
  };

  const ImageUploadSection = ({ type, label, description, aspectRatio }: {
    type: 'profilePicture' | 'coverPhoto';
    label: string;
    description: string;
    aspectRatio: string;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="space-y-2">
        {images[type] ? (
          <div className="relative">
            <img 
              src={images[type]} 
              alt={label}
              className={`rounded-lg object-cover border-2 border-gray-200 ${aspectRatio}`}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => removeImage(type)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${aspectRatio} flex flex-col items-center justify-center`}>
            <Image className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">{description}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    toast.error("Image size must be less than 5MB");
                    return;
                  }
                  handleImageUpload(type, file);
                }
              }}
              className="hidden"
              id={`${type}-upload`}
            />
            <Label 
              htmlFor={`${type}-upload`}
              className="cursor-pointer bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition-colors"
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Upload Image
            </Label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
            <p className="text-gray-600 mt-2">
              Build your online presence with a professional page
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Page Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your page name"
                      className="mt-1 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.name.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username (Optional)
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="username"
                      className="mt-1 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be your page&apos;s unique URL identifier
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger className="mt-1 border-gray-200 focus:border-blue-300 focus:ring-blue-200">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Tell people about your page..."
                      className="mt-1 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                      rows={4}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/2000 characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Image className="w-5 h-5 text-purple-600" />
                    Page Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ImageUploadSection
                      type="profilePicture"
                      label="Profile Picture"
                      description="Upload a square image (400x400px recommended)"
                      aspectRatio="w-full h-48"
                    />
                    <ImageUploadSection
                      type="coverPhoto"
                      label="Cover Photo"
                      description="Upload a wide image (1200x400px recommended)"
                      aspectRatio="w-full h-32"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Images are optional but recommended for a professional look. Maximum file size: 5MB.
                  </p>
                </CardContent>
              </Card>

              {/* Privacy & Settings */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                    Privacy & Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Privacy Level
                    </Label>
                    <RadioGroup
                      value={formData.privacy}
                      onValueChange={(value) => handleInputChange("privacy", value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-medium">Public</span>
                            <p className="text-sm text-gray-500">Anyone can view and follow your page</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friends" id="friends" />
                        <Label htmlFor="friends" className="flex items-center gap-2 cursor-pointer">
                          <Users className="w-4 h-4 text-orange-600" />
                          <div>
                            <span className="font-medium">Friends Only</span>
                            <p className="text-sm text-gray-500">Only your friends can view and follow</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="w-4 h-4 text-red-600" />
                          <div>
                            <span className="font-medium">Private</span>
                            <p className="text-sm text-gray-500">Only you and admins can view</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Page Features
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Allow Comments</span>
                          <span className="text-xs text-gray-500">Visitors can comment on posts</span>
                        </div>
                        <Switch
                          checked={formData.allowComments}
                          onCheckedChange={(checked) => handleInputChange("allowComments", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Allow Reactions</span>
                          <span className="text-xs text-gray-500">Visitors can react to posts</span>
                        </div>
                        <Switch
                          checked={formData.allowReactions}
                          onCheckedChange={(checked) => handleInputChange("allowReactions", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Allow Sharing</span>
                          <span className="text-xs text-gray-500">Visitors can share your posts</span>
                        </div>
                        <Switch
                          checked={formData.allowSharing}
                          onCheckedChange={(checked) => handleInputChange("allowSharing", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Notifications
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">New Followers</span>
                          <span className="text-xs text-gray-500">Get notified when someone follows</span>
                        </div>
                        <Switch
                          checked={formData.notifyOnFollow}
                          onCheckedChange={(checked) => handleInputChange("notifyOnFollow", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">New Comments</span>
                          <span className="text-xs text-gray-500">Get notified on new comments</span>
                        </div>
                        <Switch
                          checked={formData.notifyOnComment}
                          onCheckedChange={(checked) => handleInputChange("notifyOnComment", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card className="border-0 shadow-sm bg-white sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">Page Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cover Photo Preview */}
                  {images.coverPhoto && (
                    <div className="w-full h-24 bg-cover bg-center rounded-lg overflow-hidden">
                      <img 
                        src={images.coverPhoto} 
                        alt="Cover preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="relative inline-block">
                      {images.profilePicture ? (
                        <img 
                          src={images.profilePicture} 
                          alt="Profile preview" 
                          className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {formData.name || "Page Name"}
                    </h3>
                    {formData.username && (
                      <p className="text-sm text-gray-500">@{formData.username}</p>
                    )}
                    {formData.category && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-2">
                        {categories.find(c => c.value === formData.category)?.label}
                      </span>
                    )}
                  </div>
                  
                  {formData.description && (
                    <div className="text-sm text-gray-600 text-center">
                      {formData.description}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    {formData.privacy === "public" && <Globe className="w-4 h-4" />}
                    {formData.privacy === "friends" && <Users className="w-4 h-4" />}
                    {formData.privacy === "private" && <Shield className="w-4 h-4" />}
                    <span className="capitalize">{formData.privacy}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Choose a memorable name that reflects your brand</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Add a clear description to help people understand your page</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Select the right category for better discoverability</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Start with public privacy and adjust later if needed</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.category}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Page...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Page
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
