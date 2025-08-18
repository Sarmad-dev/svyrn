/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCampaign, createAdSet, createAd } from "@/lib/actions/campaign.action";
import { CampaignCreationForm } from "./campaign-creation/CampaignCreationForm";
import { PaymentSteps } from "./payment/PaymentSteps";
import { AdSetCreationForm } from "./ad-creation/AdSetCreationForm";
import { AdCreationForm } from "./ad-creation/AdCreationForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'campaign' | 'payment' | 'adSet' | 'ad' | 'complete';
  campaignId?: string;
  adSetId?: string;
}

type DialogStep = 'campaign' | 'payment' | 'adSet' | 'ad' | 'complete';

export const CreateAd: React.FC<CreateAdDialogProps> = ({
  isOpen,
  onClose,
  initialStep = 'campaign',
  campaignId,
  adSetId,
}) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<DialogStep>(initialStep);
  const [createdCampaign, setCreatedCampaign] = useState<any>(campaignId ? { _id: campaignId } : null);
  const [createdAdSet, setCreatedAdSet] = useState<any>(adSetId ? { _id: adSetId } : null);

  const createCampaignMutation = useMutation({
    mutationKey: ["create-campaign"],
    mutationFn: async (data: any) => {
      const token = session?.session.token as string;
      const payload = {
        ...data,
        schedule: {
          startDate: data.schedule.startDate.toISOString(),
          endDate: data.schedule.endDate.toISOString(),
        },
      };
      const res = await createCampaign({ token, data: payload });
      return res;
    },
    onSuccess: (data) => {
      setCreatedCampaign(data.campaign);
      setCurrentStep('payment');
      toast.success("Campaign created successfully! Please complete payment to activate.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create campaign");
    },
  });

  const createAdSetMutation = useMutation({
    mutationKey: ["create-ad-set"],
    mutationFn: async (data: any) => {
      const token = session?.session.token as string;
      const payload = {
        ...data,
        schedule: {
          startDate: data.schedule.startDate.toISOString(),
          endDate: data.schedule.endDate.toISOString(),
        },
      };
      const res = await createAdSet({ 
        token, 
        campaignId: data.campaignId, 
        data: payload 
      });
      return res;
    },
    onSuccess: (data) => {
      setCreatedAdSet(data.adSet);
      
      // If we're creating an ad set for an existing campaign, close the dialog
      if (campaignId) {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        toast.success("Ad set created successfully!");
        onClose();
      } else {
        // Continue to the next step in the flow
        setCurrentStep('ad');
        toast.success("Ad set created successfully! Now let's create your ads.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create ad set");
    },
  });

  const createAdMutation = useMutation({
    mutationKey: ["create-ad"],
    mutationFn: async (data: any) => {
      const token = session?.session.token as string;
      const payload = {
        ...data,
        schedule: {
          startDate: data.schedule.startDate.toISOString(),
          endDate: data.schedule.endDate.toISOString(),
        },
      };
      const res = await createAd({ 
        token, 
        adSetId: createdAdSet._id, 
        data: payload 
      });
      return res;
    },
    onSuccess: (data) => {
      setCurrentStep('complete');
      toast.success("Ad created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create ad");
    },
  });

  const handleCampaignSubmit = (data: any) => {
    createCampaignMutation.mutate(data);
  };

  const handlePaymentSuccess = async () => {
    setCurrentStep('adSet');
    toast.success("Campaign activated successfully! Now let's create your ad set.");
  };

  const handleAdSetSubmit = (data: any) => {
    
    // If we have a campaignId prop, this means we're creating an ad set for an existing campaign
    if (campaignId) {
      // Use the existing campaign ID instead of createdCampaign._id
      createAdSetMutation.mutate({
        ...data,
        campaignId: campaignId
      });
    } else {
      // Use the created campaign from the flow
      createAdSetMutation.mutate({
        ...data,
        campaignId: createdCampaign._id
      });
    }
  };

  const handleAdSubmit = (data: any) => {
    createAdMutation.mutate(data);
  };

  const handleComplete = async () => {
    await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    toast.success("Campaign, ad set, and ad created successfully!");
    onClose();
  };

  const handleAdCreated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    toast.success("Ad created successfully!");
    onClose();
  };

  const getStepTitle = () => {
    const titles = {
      campaign: "Create New Campaign",
      payment: "Complete Payment",
      adSet: "Create Ad Set",
      ad: "Create Ad",
      complete: "Setup Complete"
    };
    return titles[currentStep];
  };

  const getStepDescription = () => {
    const descriptions = {
      campaign: "Set up your campaign objectives, budget, and targeting",
      payment: "Complete payment to activate your campaign",
      adSet: "Configure your ad set targeting and placement",
      ad: "Create compelling ad creatives and copy",
      complete: "Your advertising setup is complete!"
    };
    return descriptions[currentStep];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getStepTitle()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {getStepDescription()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-center space-x-4">
            {['campaign', 'payment', 'adSet', 'ad', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step === currentStep
                      ? "bg-blue-600 text-white"
                      : step === 'campaign' || 
                        (step === 'payment' && createdCampaign) ||
                        (step === 'adSet' && createdCampaign) ||
                        (step === 'ad' && createdCampaign && createdAdSet) ||
                        (step === 'complete' && createdCampaign && createdAdSet)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {step === 'campaign' || 
                   (step === 'payment' && createdCampaign) ||
                   (step === 'adSet' && createdCampaign) ||
                   (step === 'ad' && createdCampaign && createdAdSet) ||
                   (step === 'complete' && createdCampaign && createdAdSet)
                    ? "✓"
                    : index + 1}
                </div>
                {index < 4 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2",
                      step === 'campaign' || 
                      (step === 'payment' && createdCampaign) ||
                      (step === 'adSet' && createdCampaign) ||
                      (step === 'ad' && createdCampaign && createdAdSet)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'campaign' && (
            <CampaignCreationForm
              onSubmit={handleCampaignSubmit}
              isLoading={createCampaignMutation.isPending}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentSteps
              campaign={createdCampaign}
              onPaymentSuccess={handlePaymentSuccess}
              onClose={onClose}
            />
          )}

          {currentStep === 'adSet' && (
            <AdSetCreationForm
              onSubmit={handleAdSetSubmit}
              isLoading={createAdSetMutation.isPending}
              campaignId={campaignId || createdCampaign?._id}
            />
          )}

          {currentStep === 'ad' && (
            <AdCreationForm
              onSubmit={adSetId ? handleAdCreated : handleAdSubmit}
              isLoading={createAdMutation.isPending}
              adSetId={adSetId || createdAdSet?._id}
              campaignId={campaignId || createdCampaign?._id}
            />
          )}

          {currentStep === 'complete' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Congratulations! 🎉
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your advertising campaign &quot;{createdCampaign?.name}&quot; has been successfully created with an ad set and ad. 
                  Your campaign is now ready to reach your target audience.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h4 className="font-medium text-blue-900 mb-3">What&apos;s Next?</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Your campaign will be reviewed and activated within 24 hours</p>
                  <p>• Monitor performance in the Campaign Manager</p>
                  <p>• Create additional ads to test different messages</p>
                  <p>• Adjust targeting and budget based on performance</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleComplete}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Campaign Manager
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
