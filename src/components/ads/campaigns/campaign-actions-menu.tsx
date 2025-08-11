"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Trash2, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteCampaign, getCampaignAdSets, getAdSetAds } from "@/lib/actions/campaign.action";
import { authClient } from "@/lib/auth-client";

interface CampaignActionsMenuProps {
  campaignId: string;
  campaignName: string;
  onRefresh: () => void;
  onCreateAdSet: (campaignId: string) => void;
  onCreateAd: (adSetId: string) => void;
  onViewDetails: (campaignId: string) => void;
}

export function CampaignActionsMenu({
  campaignId,
  campaignName,
  onRefresh,
  onCreateAdSet,
  onCreateAd,
  onViewDetails,
}: CampaignActionsMenuProps) {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCampaign = async () => {
    if (!session?.session.token) {
      toast.error("Authentication required");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${campaignName}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteCampaign({ token: session.session.token, id: campaignId });
      onRefresh();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdSet = async () => {
    if (!session?.session.token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const adSets = await getCampaignAdSets({ token: session.session.token, campaignId });
      if (adSets && adSets.length > 0) {
        toast.info("This campaign already has ad sets. You can create ads within existing ad sets.");
        return;
      }
      onCreateAdSet(campaignId);
    } catch (error) {
      console.error("Failed to check ad sets:", error);
      // If we can't check, allow creation anyway
      onCreateAdSet(campaignId);
    }
  };

  const handleCreateAd = async () => {
    if (!session?.session.token) {
      toast.error("Authentication required");
      return;
    }

    try {
      const adSets = await getCampaignAdSets({ token: session.session.token, campaignId });
      if (!adSets || adSets.length === 0) {
        toast.info("Please create an ad set first before creating ads.");
        return;
      }

      // Check if any ad set has ads
      let adSetWithAds = null;
      for (const adSet of adSets) {
        try {
          const ads = await getAdSetAds({ token: session.session.token, adSetId: adSet._id });
          if (!ads || ads.length === 0) {
            adSetWithAds = adSet;
            break;
          }
        } catch (error) {
          console.error("Failed to check ads for ad set:", error);
        }
      }

      if (!adSetWithAds) {
        toast.info("All ad sets already have ads. You can create additional ad sets if needed.");
        return;
      }

      onCreateAd(adSetWithAds._id);
    } catch (error) {
      console.error("Failed to check ad sets and ads:", error);
      toast.error("Unable to determine ad creation status");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onViewDetails(campaignId)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateAdSet}>
          <Plus className="mr-2 h-4 w-4" />
          Create Ad Set
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCreateAd}>
          <Settings className="mr-2 h-4 w-4" />
          Create Ad
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDeleteCampaign}
          disabled={isLoading}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isLoading ? "Deleting..." : "Delete Campaign"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
