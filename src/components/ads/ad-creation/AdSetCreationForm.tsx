/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { CalendarIcon, Users, MapPin, Settings } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const adSetSchema = z.object({
  name: z.string().min(1, "Ad set name is required").max(100, "Name cannot exceed 100 characters"),
  budget: z.object({
    type: z.enum(["daily", "lifetime"]),
    amount: z.number().min(1, "Budget must be at least $1")
  }),
  bidStrategy: z.enum(["lowest_cost", "cost_cap", "bid_cap", "target_cost"]),
  bidAmount: z.number().min(0).optional(),
  optimization: z.object({
    goal: z.enum(["impressions", "clicks", "conversions", "reach", "engagement"]),
    eventType: z.string().optional(),
    conversionWindow: z.number().min(1).max(28)
  }).optional(),
  targeting: z.object({
    demographics: z.object({
      ageMin: z.number().min(13).max(65).optional(),
      ageMax: z.number().min(13).max(65).optional(),
      genders: z.array(z.enum(["male", "female", "other"])).optional(),
      relationshipStatus: z.array(z.string()).optional(),
      education: z.array(z.string()).optional(),
      jobTitles: z.array(z.string()).optional(),
      income: z.array(z.string()).optional()
    }).optional(),
    location: z.object({
      countries: z.string().optional(), // Changed from array to string
      regions: z.array(z.string()).optional(),
      cities: z.string().optional(), // Changed from array to string
      radius: z.number().min(1).max(1000).optional()
    }).optional(),
    interests: z.array(z.object({
      category: z.string(),
      subcategory: z.string().optional(),
      weight: z.number().min(1).max(10)
    })).optional(),
    behaviors: z.array(z.object({
      type: z.string(),
      description: z.string().optional()
    })).optional()
  }).optional(),
  placement: z.object({
    platforms: z.array(z.enum(['feed', 'stories', 'reels', 'marketplace', 'messenger', 'search'])).optional(),
    devices: z.array(z.enum(["desktop", "mobile", "tablet"])).optional(),
    positions: z.array(z.enum(["feed", "stories", "reels", "search", "display"])).optional()
  }).optional(),
  schedule: z.object({
    startDate: z.date(),
    endDate: z.date()
  }),
  frequencyCap: z.object({
    impressions: z.number().min(1).optional(),
    period: z.enum(["day", "week", "month"]).optional()
  }).optional()
});

type AdSetFormData = z.infer<typeof adSetSchema>;

// Type for the processed data that will be sent to the backend
type ProcessedAdSetData = Omit<AdSetFormData, 'targeting'> & {
  targeting?: {
    demographics?: {
      ageMin?: number;
      ageMax?: number;
      genders?: string[];
      relationshipStatus?: string[];
      education?: string[];
      jobTitles?: string[];
      income?: string[];
    };
    location?: {
      countries?: string[];
      regions?: string[];
      cities?: string[];
      radius?: number;
    };
    interests?: Array<{category: string, subcategory?: string, weight: number}>;
    behaviors?: Array<{type: string, description?: string}>;
  };
};

interface AdSetCreationFormProps {
  onSubmit: (data: ProcessedAdSetData) => void;
  isLoading?: boolean;
  campaignId: string;
}

export const AdSetCreationForm: React.FC<AdSetCreationFormProps> = ({
  onSubmit,
  isLoading = false,
  campaignId
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<Array<{category: string, subcategory?: string, weight: number}>>([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState<Array<{type: string, description?: string}>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid }
  } = useForm<AdSetFormData>({
    resolver: zodResolver(adSetSchema),
    defaultValues: {
      bidStrategy: "lowest_cost" as const,
      optimization: {
        goal: "clicks",
        conversionWindow: 1
      },
      schedule: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    }
  });

  const watchedValues = watch();
  console.log("Errors", errors);
  console.log("Placment: ", getValues("placement.platforms"));

  const handleFormSubmit = (data: AdSetFormData) => {
    // Process location fields to convert comma-separated strings to arrays
    const processedData: ProcessedAdSetData = {
      ...data,
      targeting: {
        ...data.targeting,
        location: data.targeting?.location ? {
          ...data.targeting.location,
          countries: data.targeting.location.countries 
            ? data.targeting.location.countries.split(',').map(c => c.trim()).filter(c => c)
            : undefined,
          cities: data.targeting.location.cities
            ? data.targeting.location.cities.split(',').map(c => c.trim()).filter(c => c)
            : undefined,
          regions: data.targeting.location.regions,
          radius: data.targeting.location.radius,
        } : undefined,
        demographics: data.targeting?.demographics,
        interests: selectedInterests,
        behaviors: selectedBehaviors
      }
    };
    
    onSubmit(processedData);
  };

  const addInterest = () => {
    setSelectedInterests([...selectedInterests, { category: "", weight: 1 }]);
  };

  const removeInterest = (index: number) => {
    setSelectedInterests(selectedInterests.filter((_, i) => i !== index));
  };

  const updateInterest = (index: number, field: string, value: string | number) => {
    const updated = [...selectedInterests];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedInterests(updated);
  };

  const addBehavior = () => {
    setSelectedBehaviors([...selectedBehaviors, { type: "" }]);
  };

  const removeBehavior = (index: number) => {
    setSelectedBehaviors(selectedBehaviors.filter((_, i) => i !== index));
  };

  const updateBehavior = (index: number, field: string, value: string) => {
    const updated = [...selectedBehaviors];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedBehaviors(updated);
  };

  const renderStep1 = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ad Set Name *</Label>
        <Input
          id="name"
          placeholder="Enter ad set name"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

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
          <Label htmlFor="bidStrategy">Bid Strategy</Label>
          <Select
            onValueChange={(value) => setValue("bidStrategy", value as any)}
            defaultValue={watchedValues.bidStrategy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bid strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
              <SelectItem value="cost_cap">Cost Cap</SelectItem>
              <SelectItem value="bid_cap">Bid Cap</SelectItem>
              <SelectItem value="target_cost">Target Cost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bidAmount">Bid Amount (Optional)</Label>
          <Input
            id="bidAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter bid amount"
            {...register("bidAmount", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="optimizationGoal">Optimization Goal</Label>
        <Select
          onValueChange={(value) => setValue("optimization.goal", value as any)}
          defaultValue={watchedValues.optimization?.goal}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select optimization goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impressions">Impressions</SelectItem>
            <SelectItem value="clicks">Clicks</SelectItem>
            <SelectItem value="conversions">Conversions</SelectItem>
            <SelectItem value="reach">Reach</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  );

  const renderStep2 = () => (
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <h4 className="font-medium">Demographics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ageMin">Minimum Age</Label>
            <Input
              id="ageMin"
              type="number"
              min="13"
              max="65"
              placeholder="13"
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
              placeholder="65"
              {...register("targeting.demographics.ageMax", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <div className="flex gap-2">
            {["male", "female", "other"].map((gender) => (
              <Button
                key={gender}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = watchedValues.targeting?.demographics?.genders || [];
                  const updated = current.includes(gender as any)
                    ? current.filter(g => g !== gender)
                    : [...current, gender as any];
                  setValue("targeting.demographics.genders", updated);
                }}
                className={cn(
                  "capitalize",
                  watchedValues.targeting?.demographics?.genders?.includes(gender as any) && "bg-blue-100 border-blue-300"
                )}
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Location</h4>
        <div className="space-y-2">
          <Label htmlFor="countries">Countries</Label>
          <Input
            id="countries"
            placeholder="e.g., United States, Canada"
            value={watchedValues.targeting?.location?.countries || ''}
            onChange={(e) => setValue("targeting.location.countries", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cities">Cities</Label>
          <Input
            id="cities"
            placeholder="e.g., New York, Los Angeles"
            value={watchedValues.targeting?.location?.cities || ''}
            onChange={(e) => setValue("targeting.location.cities", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Interests</h4>
          <Button type="button" variant="outline" size="sm" onClick={addInterest}>
            Add Interest
          </Button>
        </div>
        {selectedInterests.map((interest, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="Interest category"
                value={interest.category}
                onChange={(e) => updateInterest(index, "category", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Subcategory (optional)"
                value={interest.subcategory || ""}
                onChange={(e) => updateInterest(index, "subcategory", e.target.value)}
              />
            </div>
            <Select
              value={interest.weight.toString()}
              onValueChange={(value) => updateInterest(index, "weight", parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((weight) => (
                  <SelectItem key={weight} value={weight.toString()}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeInterest(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  );

  const renderStep3 = () => (
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <h4 className="font-medium">Platforms & Devices</h4>
        <div className="space-y-2">
          <Label>Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {['feed', 'stories', 'reels', 'marketplace', 'messenger', 'search'].map((platform) => (
              <Button
                key={platform}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = watchedValues.placement?.platforms || [];
                  const updated = current.includes(platform as any)
                    ? current.filter(p => p !== platform)
                    : [...current, platform as any];
                  setValue("placement.platforms", updated);
                }}
                className={cn(
                  "capitalize",
                  watchedValues.placement?.platforms?.includes(platform as any) && "bg-blue-100 border-blue-300"
                )}
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Devices</Label>
          <div className="flex gap-2">
            {["desktop", "mobile", "tablet"].map((device) => (
              <Button
                key={device}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = watchedValues.placement?.devices || [];
                  const updated = current.includes(device as any)
                    ? current.filter(d => d !== device)
                    : [...current, device as any];
                  setValue("placement.devices", updated);
                }}
                className={cn(
                  "capitalize",
                  watchedValues.placement?.devices?.includes(device as any) && "bg-blue-100 border-blue-300"
                )}
              >
                {device}
              </Button>
            ))}
          </div>
        </div>
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

      <div className="space-y-4">
        <h4 className="font-medium">Frequency Cap (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequencyImpressions">Impressions</Label>
            <Input
              id="frequencyImpressions"
              type="number"
              min="1"
              placeholder="e.g., 3"
              {...register("frequencyCap.impressions", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequencyPeriod">Period</Label>
            <Select
              onValueChange={(value) => setValue("frequencyCap.period", value as any)}
              defaultValue={watchedValues.frequencyCap?.period}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="week">Per Week</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
              </SelectContent>
            </Select>
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
      1: "Basic Information",
      2: "Targeting & Demographics",
      3: "Placement & Schedule"
    };
    return titles[currentStep as keyof typeof titles];
  };

  const renderStepIcon = () => {
    const icons = {
      1: <Settings className="w-5 h-5" />,
      2: <Users className="w-5 h-5" />,
      3: <MapPin className="w-5 h-5" />
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
            Step {currentStep} of 3: Configure your ad set settings
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
              // disabled={!isValid}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Creating..." : "Create Ad Set"}
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
