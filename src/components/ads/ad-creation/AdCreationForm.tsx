/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import { CalendarIcon, Image as ImageIcon, Video, FileText, Upload, X, Plus, Trash2 } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

const adSchema = z.object({
  title: z.string().min(1, "Ad title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description cannot exceed 500 characters"),
  creative: z.object({
    type: z.enum(["image", "video", "carousel", "slideshow", "collection", "text"]),
    media: z.array(z.object({
      url: z.string().optional(),
      thumbnail: z.string().optional(),
      caption: z.string().max(200).optional(),
      altText: z.string().max(200).optional(),
      duration: z.number().min(0).optional(),
      order: z.number().min(0).optional()
    })).optional(),
    primaryText: z.string().max(125, "Primary text cannot exceed 125 characters"),
    headline: z.string().max(40, "Headline cannot exceed 40 characters"),
    callToAction: z.enum([
      "learn_more", "shop_now", "sign_up", "download", "contact_us", "book_now",
      "get_quote", "apply_now", "donate_now", "subscribe"
    ]),
    destinationUrl: z.string().url("Please enter a valid URL").optional(),
    dynamicAdCreative: z.boolean(),
    brandSafety: z.boolean()
  }),
  budget: z.object({
    type: z.enum(["daily", "lifetime"]),
    amount: z.number().min(1, "Budget must be at least $1"),
    currency: z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]),
    bidStrategy: z.enum(["lowest_cost", "cost_cap", "bid_cap"])
  }),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  schedule: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  tags: z.array(z.string()).optional()
});

type AdFormData = z.infer<typeof adSchema>;

interface AdCreationFormProps {
  onSubmit: (data: AdFormData) => void;
  isLoading?: boolean;
  adSetId: string;
  campaignId: string;
}

export const AdCreationForm: React.FC<AdCreationFormProps> = ({
  onSubmit,
  isLoading = false,
  adSetId,
  campaignId
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<Array<{
    file: File;
    preview: string;
    type: 'image' | 'video';
    caption?: string;
    altText?: string;
  }>>([]);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      creative: {
        type: "image",
        primaryText: "",
        headline: "",
        callToAction: "learn_more",
        dynamicAdCreative: false,
        brandSafety: true
      },
      budget: {
        type: "daily",
        currency: "USD",
        bidStrategy: "lowest_cost"
      },
      schedule: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    }
  });

  const watchedValues = watch();

  const handleFormSubmit = (data: AdFormData) => {
    // Add selected tags and media files to the data
    const enrichedData = {
      ...data,
      tags: selectedTags,
      creative: {
        ...data.creative,
        media: mediaFiles.map((file, index) => ({
          url: file.preview, // In real implementation, this would be the uploaded URL
          thumbnail: file.preview,
          caption: file.caption,
          altText: file.altText,
          duration: file.type === 'video' ? 0 : undefined,
          order: index
        }))
      }
    };
    onSubmit(enrichedData);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const isVideo = file.type.startsWith('video/');
          const newMedia = {
            file,
            preview: reader.result as string,
            type: isVideo ? 'video' as const : 'image' as const,
            caption: "",
            altText: ""
          };
          setMediaFiles(prev => [...prev, newMedia]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateMedia = (index: number, field: string, value: string) => {
    setMediaFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const renderStep1 = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Ad Title *</Label>
        <Input
          id="title"
          placeholder="Enter ad title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Enter ad description"
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="creativeType">Creative Type *</Label>
        <Select
          onValueChange={(value) => setValue("creative.type", value as any)}
          defaultValue={watchedValues.creative?.type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select creative type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Single Image</SelectItem>
            <SelectItem value="video">Single Video</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="slideshow">Slideshow</SelectItem>
            <SelectItem value="collection">Collection</SelectItem>
            <SelectItem value="text">Text Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Media Upload</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaUpload}
            className="hidden"
            id="media-upload"
          />
          <label htmlFor="media-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600 mt-2">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500">Images, videos up to 100MB</p>
          </label>
        </div>
      </div>

      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Uploaded Media</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaFiles.map((media, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="relative">
                  {media.type === 'image' ? (
                    <Image
                      src={media.preview}
                      alt="Media preview"
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={media.preview}
                      className="w-full h-32 object-cover rounded"
                      controls
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeMedia(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Caption (optional)"
                    value={media.caption || ""}
                    onChange={(e) => updateMedia(index, "caption", e.target.value)}
                  />
                  <Input
                    placeholder="Alt text (optional)"
                    value={media.altText || ""}
                    onChange={(e) => updateMedia(index, "altText", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  );

  const renderStep2 = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="primaryText">Primary Text *</Label>
        <Textarea
          id="primaryText"
          placeholder="Enter primary text for your ad"
          rows={3}
          maxLength={125}
          {...register("creative.primaryText")}
        />
        <div className="text-xs text-gray-500 text-right">
          {watchedValues.creative?.primaryText?.length || 0}/125
        </div>
        {errors.creative?.primaryText && (
          <p className="text-sm text-red-500">{errors.creative.primaryText.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Headline *</Label>
        <Input
          id="headline"
          placeholder="Enter headline"
          maxLength={40}
          {...register("creative.headline")}
        />
        <div className="text-xs text-gray-500 text-right">
          {watchedValues.creative?.headline?.length || 0}/40
        </div>
        {errors.creative?.headline && (
          <p className="text-sm text-red-500">{errors.creative.headline.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="callToAction">Call to Action</Label>
          <Select
            onValueChange={(value) => setValue("creative.callToAction", value as any)}
            defaultValue={watchedValues.creative?.callToAction}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select call to action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learn_more">Learn More</SelectItem>
              <SelectItem value="shop_now">Shop Now</SelectItem>
              <SelectItem value="sign_up">Sign Up</SelectItem>
              <SelectItem value="download">Download</SelectItem>
              <SelectItem value="contact_us">Contact Us</SelectItem>
              <SelectItem value="book_now">Book Now</SelectItem>
              <SelectItem value="get_quote">Get Quote</SelectItem>
              <SelectItem value="apply_now">Apply Now</SelectItem>
              <SelectItem value="donate_now">Donate Now</SelectItem>
              <SelectItem value="subscribe">Subscribe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destinationUrl">Destination URL</Label>
          <Input
            id="destinationUrl"
            type="url"
            placeholder="https://example.com"
            {...register("creative.destinationUrl")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Creative Options</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("creative.dynamicAdCreative")}
              className="rounded"
            />
            <span className="text-sm">Enable dynamic ad creative</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("creative.brandSafety")}
              className="rounded"
            />
            <span className="text-sm">Enable brand safety features</span>
          </label>
        </div>
      </div>
    </CardContent>
  );

  const renderStep3 = () => (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budgetType">Budget Type *</Label>
          <Select
            onValueChange={(value) => setValue("budget.type", value as "daily" | "lifetime")}
            defaultValue={watchedValues.budget?.type}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Budget</SelectItem>
              <SelectItem value="lifetime">Lifetime Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetAmount">Budget Amount *</Label>
          <Input
            id="budgetAmount"
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            {...register("budget.amount", { valueAsNumber: true })}
          />
          {errors.budget?.amount && (
            <p className="text-sm text-red-500">{errors.budget.amount.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            onValueChange={(value) => setValue("budget.currency", value as any)}
            defaultValue={watchedValues.budget?.currency}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
              <SelectItem value="CAD">CAD (C$)</SelectItem>
              <SelectItem value="AUD">AUD (A$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bidStrategy">Bid Strategy</Label>
          <Select
            onValueChange={(value) => setValue("budget.bidStrategy", value as any)}
            defaultValue={watchedValues.budget?.bidStrategy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bid strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
              <SelectItem value="cost_cap">Cost Cap</SelectItem>
              <SelectItem value="bid_cap">Bid Cap</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (days) *</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          placeholder="Enter duration in days"
          {...register("duration", { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-sm text-red-500">{errors.duration.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedValues.schedule?.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedValues.schedule?.startDate ? (
                    format(watchedValues.schedule.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watchedValues.schedule?.startDate}
                  onSelect={(date) => setValue("schedule.startDate", date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedValues.schedule?.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedValues.schedule?.endDate ? (
                    format(watchedValues.schedule.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watchedValues.schedule?.endDate}
                  onSelect={(date) => setValue("schedule.endDate", date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </CardContent>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === currentStep
                  ? "bg-blue-600 text-white"
                  : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {step < currentStep ? "✓" : step}
            </div>
            {step < 3 && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-2",
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepTitle = () => {
    const titles = {
      1: "Creative Content",
      2: "Ad Copy & Settings",
      3: "Budget & Schedule"
    };
    return titles[currentStep as keyof typeof titles];
  };

  const renderStepIcon = () => {
    const icons = {
      1: <ImageIcon className="w-5 h-5" />,
      2: <FileText className="w-5 h-5" />,
      3: <CalendarIcon className="w-5 h-5" />
    };
    return icons[currentStep as keyof typeof icons];
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {renderStepIcon()}
            {renderStepTitle()}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of 3: Configure your ad settings
          </CardDescription>
        </CardHeader>

        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <CardContent className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Ad"}
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
