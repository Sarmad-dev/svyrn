/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, Target, Users, Settings, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(100, "Campaign name cannot exceed 100 characters"),
  image: z.string().optional(),
  objective: z.enum([
    "awareness", "reach", "traffic", "engagement", "app_installs",
    "video_views", "lead_generation", "messages", "conversions", "catalog_sales"
  ]),
  budget: z.object({
    type: z.enum(["daily", "lifetime"]),
    amount: z.number().min(1, "Budget must be at least $1"),
    currency: z.string().default("USD")
  }),
  schedule: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  targeting: z.object({
    demographics: z.object({
      ageMin: z.number().min(13).max(65),
      ageMax: z.number().min(13).max(65),
      genders: z.array(z.enum(["male", "female", "other"])).optional(),
      languages: z.array(z.string()).optional()
    }),
    location: z.object({
      countries: z.array(z.string()).optional(),
      regions: z.array(z.string()).optional(),
      cities: z.array(z.string()).optional(),
      radius: z.number().optional(),
      coordinates: z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional()
      }).optional()
    }),
    interests: z.array(z.object({
      category: z.string(),
      subcategory: z.string().optional(),
      weight: z.number().min(1).max(10).default(1)
    })).optional(),
    behaviors: z.array(z.object({
      type: z.string(),
      description: z.string()
    })).optional()
  }),
  campaignBudgetOptimization: z.boolean().default(false),
  specialAdCategories: z.array(z.string()).optional()
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignCreationFormProps {
  onSubmit: (data: CampaignFormData) => void;
  isLoading?: boolean;
}

const objectives = [
  { value: "awareness", label: "Brand Awareness", description: "Increase awareness of your brand" },
  { value: "reach", label: "Reach", description: "Show your ad to as many people as possible" },
  { value: "traffic", label: "Traffic", description: "Drive traffic to your website or app" },
  { value: "engagement", label: "Engagement", description: "Get people to interact with your content" },
  { value: "app_installs", label: "App Installs", description: "Get people to install your app" },
  { value: "video_views", label: "Video Views", description: "Get people to watch your videos" },
  { value: "lead_generation", label: "Lead Generation", description: "Collect leads for your business" },
  { value: "messages", label: "Messages", description: "Get people to message your business" },
  { value: "conversions", label: "Conversions", description: "Get people to take specific actions" },
  { value: "catalog_sales", label: "Catalog Sales", description: "Drive sales from your product catalog" }
];

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan", "India", "Brazil", "Mexico"
];

const interestCategories = [
  "Entertainment", "Sports", "Technology", "Fashion", "Food & Drink", "Travel", "Business", "Health & Fitness", "Education", "Shopping"
];

export const CampaignCreationForm: React.FC<CampaignCreationFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema) as any,
    defaultValues: {
      budget: { currency: "USD" },
      targeting: {
        demographics: { ageMin: 18, ageMax: 65 },
        location: { countries: [] },
        interests: [],
        behaviors: []
      },
      campaignBudgetOptimization: false,
      specialAdCategories: []
    }
  });

  const watchedObjective = watch("objective");
  const watchedBudgetType = watch("budget.type");
  const watchedStartDate = watch("schedule.startDate");
  const watchedEndDate = watch("schedule.endDate");

  const handleDateSelect = (date: Date | undefined, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
      setValue("schedule.startDate", date || new Date());
    } else {
      setEndDate(date);
      setValue("schedule.endDate", date || new Date());
    }
  };

  const calculateTotalCost = () => {
    const budgetAmount = watch("budget.amount") || 0;
    if (watchedBudgetType === "daily" && watchedStartDate && watchedEndDate) {
      const days = Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24));
      return budgetAmount * days;
    }
    return budgetAmount;
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          // Store base64 data for backend
          setValue("image", reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Failed to load image preview.");
        console.error("Image preview error:", error);
      }
    } else {
      setImagePreview(null);
      setValue("image", "");
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Campaign Basics
        </CardTitle>
        <CardDescription>
          Set up your campaign name and objective
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            placeholder="Enter campaign name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Campaign Image (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="image" className="cursor-pointer">
              {!imagePreview ? (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <Image
                      src={imagePreview}
                      alt="Campaign Image Preview"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview(null);
                        setValue("image", "");
                      }}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Click to change image</p>
                </div>
              )}
            </label>
          </div>
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Add a campaign image for better branding and recognition
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objective">Campaign Objective</Label>
          <Select onValueChange={(value) => setValue("objective", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an objective" />
            </SelectTrigger>
            <SelectContent>
              {objectives.map((objective) => (
                <SelectItem key={objective.value} value={objective.value}>
                  <div>
                    <div className="font-medium">{objective.label}</div>
                    <div className="text-sm text-muted-foreground">{objective.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.objective && (
            <p className="text-sm text-red-500">{errors.objective.message}</p>
          )}
        </div>

        {watchedObjective && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Objective: {objectives.find(o => o.value === watchedObjective)?.label}</h4>
            <p className="text-sm text-blue-700 mt-1">
              {objectives.find(o => o.value === watchedObjective)?.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Budget & Schedule
        </CardTitle>
        <CardDescription>
          Set your budget and campaign schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budgetType">Budget Type</Label>
            <Select onValueChange={(value) => setValue("budget.type", value as "daily" | "lifetime")}>
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
            <Label htmlFor="budgetAmount">Budget Amount ($)</Label>
            <Input
              id="budgetAmount"
              type="number"
              min="1"
              placeholder="Enter budget amount"
              {...register("budget.amount", { valueAsNumber: true })}
            />
            {errors.budget?.amount && (
              <p className="text-sm text-red-500">{errors.budget.amount.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => handleDateSelect(date, "start")}
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
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => handleDateSelect(date, "end")}
                  initialFocus
                  disabled={(date) => date <= (startDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {watchedBudgetType && watchedStartDate && watchedEndDate && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">Campaign Cost Estimate</h4>
            <p className="text-2xl font-bold text-green-700">${calculateTotalCost().toFixed(2)}</p>
            <p className="text-sm text-green-600">
              {watchedBudgetType === "daily" 
                ? `$${watch("budget.amount") || 0} per day × ${Math.ceil((watchedEndDate.getTime() - watchedStartDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                : "Lifetime budget"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Audience Targeting
        </CardTitle>
        <CardDescription>
          Define who will see your ads
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Demographics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageMin">Minimum Age</Label>
              <Input
                id="ageMin"
                type="number"
                min="13"
                max="65"
                {...register("targeting.demographics.ageMin", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageMax">Maximum Age</Label>
              <Input
                id="ageMax"
                type="number"
                min="13"
                max="65"
                {...register("targeting.demographics.ageMax", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Location</h4>
          <div className="space-y-2">
            <Label htmlFor="countries">Countries</Label>
            <Select onValueChange={(value) => {
              const currentCountries = watch("targeting.location.countries") || [];
              if (!currentCountries.includes(value)) {
                setValue("targeting.location.countries", [...currentCountries, value]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Add countries" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {(watch("targeting.location.countries") || []).map((country) => (
                <span
                  key={country}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                >
                  {country}
                  <button
                    type="button"
                    onClick={() => {
                      const currentCountries = watch("targeting.location.countries") || [];
                      setValue("targeting.location.countries", currentCountries.filter(c => c !== country));
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Interests</h4>
          <div className="space-y-2">
            <Select onValueChange={(value) => {
              const currentInterests = watch("targeting.interests") || [];
              if (!currentInterests.find(i => i.category === value)) {
                setValue("targeting.interests", [...currentInterests, { category: value, weight: 1 }]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Add interests" />
              </SelectTrigger>
              <SelectContent>
                {interestCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2 mt-2">
              {(watch("targeting.interests") || []).map((interest, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="flex-1">{interest.category}</span>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    className="w-20"
                    value={interest.weight}
                    onChange={(e) => {
                      const currentInterests = watch("targeting.interests") || [];
                      currentInterests[index].weight = parseInt(e.target.value);
                      setValue("targeting.interests", [...currentInterests]);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const currentInterests = watch("targeting.interests") || [];
                      setValue("targeting.interests", currentInterests.filter((_, i) => i !== index));
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review & Create</CardTitle>
        <CardDescription>
          Review your campaign settings before creating
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700">Campaign Name</h5>
              <p className="text-gray-900">{watch("name")}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700">Objective</h5>
              <p className="text-gray-900">{objectives.find(o => o.value === watch("objective"))?.label}</p>
            </div>
          </div>

          {imagePreview && (
            <div>
              <h5 className="font-medium text-gray-700">Campaign Image</h5>
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Campaign Image"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700">Budget</h5>
              <p className="text-gray-900">
                ${watch("budget.amount")} {watch("budget.type")}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700">Total Cost</h5>
              <p className="text-gray-900">${calculateTotalCost().toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700">Start Date</h5>
              <p className="text-gray-900">{startDate ? format(startDate, "PPP") : "Not set"}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700">End Date</h5>
              <p className="text-gray-900">{endDate ? format(endDate, "PPP") : "Not set"}</p>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-700">Targeting</h5>
            <p className="text-gray-900">
              Ages {watch("targeting.demographics.ageMin") || 18}-{watch("targeting.demographics.ageMax") || 65}
              {(watch("targeting.location.countries") || [])?.length > 0 && 
                ` • ${(watch("targeting.location.countries") || []).length} countries`
              }
              {(watch("targeting.interests") || [])?.length > 0 && 
                ` • ${(watch("targeting.interests") || []).length} interests`
              }
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">Next Steps</h4>
          <p className="text-sm text-blue-700 mt-1">
            After creating your campaign, you&apos;ll be able to create ad sets and ads to complete your advertising setup.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {["Campaign Basics", "Budget & Schedule", "Audience Targeting", "Review & Create"].map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index + 1 <= currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1 < currentStep ? "✓" : index + 1}
              </div>
              <span className="text-xs mt-1 text-center max-w-20">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              // disabled={!isValid}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              // disabled={!isValid || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
