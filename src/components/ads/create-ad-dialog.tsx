/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCampaign } from "@/lib/actions/campaign.action";
import { CampaignCreationForm } from "./campaign-creation/CampaignCreationForm";
import { toast } from "sonner";

interface CreateAdDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAd: React.FC<CreateAdDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState<any>(null);

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
      setShowPayment(true);
      toast.success("Campaign created successfully! Please complete payment to activate.");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create campaign");
    },
  });

  const handleCampaignSubmit = (data: any) => {
    createCampaignMutation.mutate(data);
  };

  const handlePaymentSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    toast.success("Campaign activated successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Campaign
          </h2>
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

        {/* Content */}
        <div className="p-6">
          {!showPayment ? (
            <CampaignCreationForm
              onSubmit={handleCampaignSubmit}
              isLoading={createCampaignMutation.isPending}
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h3 className="text-lg font-medium text-gray-900">
                Campaign Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your campaign "{createdCampaign?.name}" has been created. 
                You can now create ad sets and ads to complete your advertising setup.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handlePaymentSuccess}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Campaign Manager
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
